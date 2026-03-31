import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 输入验证 Schema
const GenerateImageSchema = z.object({
  prompt: z.string()
    .min(1, "提示词不能为空")
    .max(500, "提示词不能超过500字符"),
  productName: z.string()
    .min(1, "商品名称不能为空")
    .max(100, "商品名称不能超过100字符"),
  category: z.enum([
    "Hoodies", "T-Shirts", "Pants", "Jackets", 
    "Sweaters", "Tops", "Accessories"
  ]).optional().default("Hoodies"),
});

// 简单的内存速率限制（生产环境应使用 Redis/Upstash）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 请求次数限制
const RATE_WINDOW = 60 * 1000; // 时间窗口（1分钟）

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
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
    // 1. 速率限制检查
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // 2. 获取并验证请求体
    const body = await request.json();
    
    // 3. 输入验证
    const validationResult = GenerateImageSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => ({
        field: e.path.join("."),
        message: e.message
      }));
      return NextResponse.json(
        { error: "输入验证失败", details: errors },
        { status: 400 }
      );
    }

    const { prompt, productName, category } = validationResult.data;
    const apiKey = process.env.SEEDREAM_KEY;

    // 4. API Key 检查
    if (!apiKey) {
      console.error("SEEDREAM_KEY 环境变量未设置");
      return NextResponse.json(
        { error: "服务器配置错误，请联系管理员" },
        { status: 500 }
      );
    }

    // 5. 构建详细的商品视频生成提示词
    const detailedPrompt = `电商产品视频，${productName}，${category}类别，现代简约风格，专业灯光，产品展示，清晰细节，高品质，时尚潮流，${prompt || ''}。适合用于电商平台展示。`;

    // 6. 调用火山引擎 API
    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "doubao-seedance-1-0-pro-250528",
        content: [
          {
            type: "text",
            text: detailedPrompt
          }
        ],
        ratio: "16:9",
        duration: 5,
        watermark: false,
      }),
    });

    const data = await response.json();

    // 7. API 错误处理
    if (!response.ok) {
      console.error("Seedance API error:", data);
      return NextResponse.json(
        { error: data.error?.message || "视频生成服务错误" },
        { status: response.status }
      );
    }

    // 8. 返回成功结果
    return NextResponse.json({
      success: true,
      taskId: data.data?.task_id,
      taskStatus: data.data?.task_status || "processing",
    });

  } catch (error) {
    console.error("Seedance generation error:", error);
    
    // 区分不同错误类型
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "输入验证失败" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

// 轮询视频生成状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    // 1. 验证 taskId
    if (!taskId || typeof taskId !== "string") {
      return NextResponse.json(
        { error: "缺少有效的 taskId 参数" },
        { status: 400 }
      );
    }

    // 2. 速率限制检查
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        { status: 429 }
      );
    }

    const apiKey = process.env.SEEDREAM_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "服务器配置错误" },
        { status: 500 }
      );
    }

    const response = await fetch(`https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Seedance status check error:", data);
      return NextResponse.json(
        { error: data.error?.message || "查询失败" },
        { status: response.status }
      );
    }

    // 检查任务状态
    const taskStatus = data.data?.task_status;
    const videoUrl = data.data?.output?.video?.url;

    if (taskStatus === "succeeded" && videoUrl) {
      return NextResponse.json({
        success: true,
        taskStatus: "succeeded",
        videoUrl: videoUrl,
      });
    } else if (taskStatus === "failed") {
      return NextResponse.json({
        success: false,
        taskStatus: "failed",
        error: data.data?.error?.message || "视频生成失败",
      });
    } else {
      // 仍在处理中
      return NextResponse.json({
        success: true,
        taskStatus: taskStatus || "processing",
        progress: data.data?.progress || 0,
      });
    }
  } catch (error) {
    console.error("Seedance status check error:", error);
    return NextResponse.json(
      { error: "查询服务出错" },
      { status: 500 }
    );
  }
}