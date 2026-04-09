import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 定价策略类型
const PRICING_STRATEGY = {
  COST_PLUS: "cost_plus",        // 成本加成
  COMPETITIVE: "competitive",     // 竞争导向
  DYNAMIC: "dynamic",            // 动态定价
  PREMIUM: "premium",             // 高端定价
} as const;

// 输入验证 Schema
const PricingSchema = z.object({
  // 商品信息
  productName: z.string().min(1, "商品名称不能为空"),
  category: z.string().optional(),

  // 成本信息 (必填)
  cost: z.number().positive("成本价必须为正数"),
  shippingCost: z.number().optional().default(0),
  platformFee: z.number().optional().default(0),  // 平台佣金百分比，如 15 表示 15%

  // 市场数据 (可选)
  competitorPrices: z.array(z.number()).optional(),  // 竞品价格数组
  averageMarketPrice: z.number().optional(),         // 市场均价
  demandLevel: z.enum(["low", "medium", "high", "very_high"]).optional().default("medium"),

  // 定价策略
  strategy: z.enum(Object.values(PRICING_STRATEGY)).optional().default("dynamic"),

  // 目标利润率
  targetProfitMargin: z.number().min(0).max(100).optional().default(20),

  // 汇率 (可选，默认为人民币)
  exchangeRates: z.object({
    USD: z.number().optional().default(7.2),   // 1 USD = 7.2 CNY
    EUR: z.number().optional().default(7.8),
    GBP: z.number().optional().default(9.0),
    JPY: z.number().optional().default(0.048),
  }).optional(),
});

// 简单汇率获取 (实际项目中可以从API获取)
function getExchangeRates() {
  return {
    USD: 7.2,
    EUR: 7.8,
    GBP: 9.0,
    JPY: 0.048,
  };
}

// 计算最优价格
function calculateOptimalPrice(data: {
  cost: number;
  shippingCost: number;
  platformFee: number;
  competitorPrices?: number[];
  averageMarketPrice?: number;
  demandLevel: string;
  strategy: string;
  targetProfitMargin: number;
  exchangeRates: { USD: number; EUR: number; GBP: number; JPY: number };
}) {
  const {
    cost,
    shippingCost,
    platformFee,
    competitorPrices,
    averageMarketPrice,
    demandLevel,
    strategy,
    targetProfitMargin,
    exchangeRates,
  } = data;

  const totalCost = cost + shippingCost;
  let recommendedPrice: number;
  let priceRange: { min: number; max: number };
  let confidence: number;
  let reasoning: string[] = [];

  switch (strategy) {
    case PRICING_STRATEGY.COST_PLUS:
      // 成本加成定价
      const costPlusPrice = totalCost * (1 + targetProfitMargin / 100);
      recommendedPrice = Math.ceil(costPlusPrice);
      priceRange = {
        min: Math.ceil(totalCost * 1.1),
        max: Math.ceil(totalCost * 1.3),
      };
      confidence = 0.85;
      reasoning.push(`基于成本 ${totalCost.toFixed(2)} 元，目标利润率 ${targetProfitMargin}%`);
      break;

    case PRICING_STRATEGY.COMPETITIVE:
      // 竞争导向定价
      if (competitorPrices && competitorPrices.length > 0) {
        const avgCompetitor = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
        // 在竞品均价基础上略低一点，保持竞争力
        recommendedPrice = Math.ceil(avgCompetitor * 0.95);
        priceRange = {
          min: Math.min(...competitorPrices) * 0.9,
          max: Math.max(...competitorPrices) * 1.05,
        };
        confidence = 0.8;
        reasoning.push(`参考 ${competitorPrices.length} 个竞品价格，均价 ${avgCompetitor.toFixed(2)} 元`);
      } else if (averageMarketPrice) {
        recommendedPrice = Math.ceil(averageMarketPrice * 0.95);
        priceRange = {
          min: averageMarketPrice * 0.85,
          max: averageMarketPrice * 1.1,
        };
        confidence = 0.7;
        reasoning.push(`参考市场价 ${averageMarketPrice} 元`);
      } else {
        // 没有竞品数据，回退到成本加成
        recommendedPrice = Math.ceil(totalCost * (1 + targetProfitMargin / 100));
        priceRange = { min: totalCost * 1.1, max: totalCost * 1.3 };
        confidence = 0.5;
        reasoning.push("无竞品数据，使用成本加成");
      }
      break;

    case PRICING_STRATEGY.PREMIUM:
      // 高端定价
      const premiumPrice = averageMarketPrice
        ? Math.ceil(averageMarketPrice * 1.2)
        : Math.ceil(totalCost * 1.5);
      recommendedPrice = premiumPrice;
      priceRange = { min: premiumPrice * 0.9, max: premiumPrice * 1.15 };
      confidence = 0.65;
      reasoning.push("采用高端定价策略");
      break;

    case PRICING_STRATEGY.DYNAMIC:
    default:
      // 动态定价 - 综合考虑多个因素
      let basePrice = totalCost;

      // 需求系数
      const demandMultiplier: Record<string, number> = {
        low: 0.9,
        medium: 1.0,
        high: 1.15,
        very_high: 1.3,
      };

      basePrice *= demandMultiplier[demandLevel] || 1.0;
      reasoning.push(`需求等级 ${demandLevel}，系数 ${demandMultiplier[demandLevel]}`);

      // 竞品影响
      if (competitorPrices && competitorPrices.length > 0) {
        const minCompetitor = Math.min(...competitorPrices);
        const maxCompetitor = Math.max(...competitorPrices);
        const avgCompetitor = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;

        if (basePrice > maxCompetitor) {
          basePrice = maxCompetitor * 0.98; // 略低于最高价
          reasoning.push(`价格略低于竞品最高价 ${maxCompetitor.toFixed(2)}`);
        } else if (basePrice < minCompetitor) {
          basePrice = minCompetitor * 1.02; // 略高于最低价，保持利润
          reasoning.push(`价格略高于竞品最低价 ${minCompetitor.toFixed(2)}`);
        } else {
          basePrice = avgCompetitor;
          reasoning.push(`价格参考竞品均价 ${avgCompetitor.toFixed(2)}`);
        }
      }

      // 平台佣金考虑
      if (platformFee > 0) {
        // 确保覆盖平台费用
        basePrice = Math.max(basePrice, totalCost / (1 - platformFee / 100));
        reasoning.push(`考虑平台佣金 ${platformFee}%`);
      }

      recommendedPrice = Math.ceil(basePrice);
      const minPrice = Math.ceil(totalCost * 1.08); // 至少 8% 利润
      const maxPrice = Math.ceil((averageMarketPrice || totalCost * 1.5) * 1.1);
      priceRange = { min: minPrice, max: maxPrice };
      confidence = 0.75;
      reasoning.push("动态定价综合考虑成本、需求和竞品");
      break;
  }

  // 计算利润率
  const platformFeeAmount = recommendedPrice * (platformFee / 100);
  const profit = recommendedPrice - totalCost - platformFeeAmount;
  const profitMargin = (profit / recommendedPrice) * 100;

  return {
    recommendedPrice,
    priceRange,
    confidence,
    reasoning,
    analysis: {
      totalCost: Math.round(totalCost * 100) / 100,
      estimatedPlatformFee: Math.round(platformFeeAmount * 100) / 100,
      estimatedProfit: Math.round(profit * 100) / 100,
      profitMargin: Math.round(profitMargin * 10) / 10,
    },
    multiCurrency: {
      USD: (recommendedPrice / exchangeRates.USD).toFixed(2),
      EUR: (recommendedPrice / exchangeRates.EUR).toFixed(2),
      GBP: (recommendedPrice / exchangeRates.GBP).toFixed(2),
      JPY: (recommendedPrice / exchangeRates.JPY).toFixed(0),
    },
  };
}

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
    // 速率限制
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        { status: 429 }
      );
    }

    // 解析请求
    const body = await request.json();
    const validation = PricingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "参数错误", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;
    const exchangeRates = data.exchangeRates || getExchangeRates();

    // 使用 AI 优化定价建议 (可选，如果配置了百炼 API)
    const apiKey = process.env.BAILLIAN_API_KEY;
    const useAI = apiKey && data.strategy === "dynamic";

    let aiSuggestion = null;

    if (useAI) {
      try {
        const endpoint = process.env.BAILLIAN_API_ENDPOINT || "https://dashscope.aliyuncs.com/compatible-mode/v1";

        const aiPrompt = `
作为跨境电商定价专家，请分析以下商品并给出定价建议：

商品信息：
- 名称：${data.productName}
- 类别：${data.category || "未知"}
- 成本：${data.cost} 元
- 运费：${data.shippingCost} 元
- 平台佣金：${data.platformFee}%
- 目标利润率：${data.targetProfitMargin}%
- 需求等级：${data.demandLevel}
- 定价策略：${data.strategy}

${data.competitorPrices ? `- 竞品价格：${data.competitorPrices.join(", ")} 元` : ""}
${data.averageMarketPrice ? `- 市场均价：${data.averageMarketPrice} 元` : ""}

请给出：
1. 简短的市场分析
2. 定价建议（包括理由）
3. 可能的风险和机会
`;

        const response = await fetch(`${endpoint}/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "qwen-turbo",
            messages: [
              {
                role: "system",
                content: "你是一个专业的跨境电商定价顾问，擅长分析市场数据、竞品价格、成本结构，给出最优定价建议。回答要简洁、专业，使用中文。"
              },
              {
                role: "user",
                content: aiPrompt
              }
            ],
            temperature: 0.5,
            max_tokens: 1000,
          }),
        });

        if (response.ok) {
          const aiData = await response.json();
          aiSuggestion = aiData.choices?.[0]?.message?.content?.trim() || null;
        }
      } catch (error) {
        console.error("AI定价建议失败:", error);
      }
    }

    // 计算定价
    const pricing = calculateOptimalPrice({
      ...data,
      exchangeRates,
    });

    return NextResponse.json({
      product: {
        name: data.productName,
        category: data.category,
      },
      pricing,
      aiSuggestion,
      strategy: data.strategy,
    });

  } catch (error) {
    console.error("定价API异常:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

// GET 方法返回支持的策略
export async function GET() {
  return NextResponse.json({
    strategies: Object.entries(PRICING_STRATEGY).map(([key, value]) => ({
      id: value,
      name: {
        cost_plus: "成本加成",
        competitive: "竞争导向",
        dynamic: "动态定价",
        premium: "高端定价",
      }[key],
      description: {
        cost_plus: "基于成本和目标利润率计算价格",
        competitive: "参考竞品价格进行定价",
        dynamic: "综合考虑成本、需求、竞品的智能定价",
        premium: "高端定价，追求品牌溢价",
      }[key],
    })),
    demandLevels: [
      { id: "low", name: "低", description: "市场需求较低" },
      { id: "medium", name: "中等", description: "市场需求一般" },
      { id: "high", name: "高", description: "市场需求旺盛" },
      { id: "very_high", name: "非常高", description: "爆款/稀缺商品" },
    ],
  });
}