import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 支持的语言
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "英语" },
  { code: "ja", name: "日语" },
  { code: "ko", name: "韩语" },
  { code: "es", name: "西班牙语" },
  { code: "fr", name: "法语" },
  { code: "de", name: "德语" },
  { code: "it", name: "意大利语" },
  { code: "pt", name: "葡萄牙语" },
  { code: "ru", name: "俄语" },
  { code: "ar", name: "阿拉伯语" },
] as const;

// 输入验证 Schema
const TranslateSchema = z.object({
  text: z.string()
    .min(1, "翻译文本不能为空")
    .max(5000, "文本不能超过5000字符"),
  targetLang: z.enum(SUPPORTED_LANGUAGES.map(l => l.code) as [string, ...string[]])
    .describe("目标语言代码"),
  sourceLang: z.enum(["auto", ...SUPPORTED_LANGUAGES.map(l => l.code)] as [string, ...string[]])
    .optional()
    .default("auto"),
  context: z.string().optional()
    .describe("可选的上下文信息，帮助更准确的翻译"),
});

// 速率限制
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        { status: 429 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const validation = TranslateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "参数错误", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { text, targetLang, sourceLang, context } = validation.data;

    // 获取目标语言名称
    const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
    const sourceLangName = sourceLang === "auto" ? "自动检测" : (SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name || sourceLang);

    // 构建 prompt
    let prompt = `请将以下文本翻译成${targetLangName}`;
    if (context) {
      prompt += `。背景上下文：${context}`;
    }
    prompt += `\n\n待翻译文本：\n${text}`;

    // 调用百炼 API (使用 DashScope)
    const apiKey = process.env.BAILLIAN_API_KEY;
    const endpoint = process.env.BAILLIAN_API_ENDPOINT || "https://dashscope.aliyuncs.com/compatible-mode/v1";

    if (!apiKey) {
      // 如果没有配置百炼，使用免费的翻译 API 作为回退
      return NextResponse.json({
        error: "翻译服务未配置",
        translation: text, // 回退：返回原文
        sourceLang: sourceLang === "auto" ? "zh" : sourceLang,
        targetLang,
        service: "fallback",
      });
    }

    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-turbo", // 使用便宜快速的模型
        messages: [
          {
            role: "system",
            content: "你是一个专业的跨境电商翻译助手，擅长将商品描述、标题、营销文案等翻译成目标语言。要求：1) 翻译准确且符合目标语言习惯 2) 保持原文的语气和风格 3) 对于营销文案，可以适当本地化 4) 只返回翻译结果，不要添加任何解释"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("翻译API错误:", errorData);
      return NextResponse.json(
        { error: "翻译服务调用失败" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content?.trim() || text;

    return NextResponse.json({
      originalText: text,
      translation,
      sourceLang: sourceLang === "auto" ? "zh" : sourceLang,
      targetLang,
      service: "bailian",
    });

  } catch (error) {
    console.error("翻译API异常:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

// GET 方法返回支持的语言列表
export async function GET() {
  return NextResponse.json({
    languages: SUPPORTED_LANGUAGES,
  });
}