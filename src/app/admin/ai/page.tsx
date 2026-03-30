"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Package, TrendingUp, Zap, ArrowRight, Copy, Check, Store, BarChart3, Image, FileText, Settings, RefreshCw, ExternalLink, Users, Eye, DollarSign } from "lucide-react";
import { aiProductSuggestions, erpProductData, competitorStoreData, competitorAnalysis, platformKeywords, keywordSuggestions, historicalSalesData, competitorSalesData, industryTrendData, forecastWeightConfig } from "@/lib/data";
import Link from "next/link";

type TabType = "product-selection" | "erp-sourcing" | "competitor-stores" | "competitor-analysis" | "product-listing" | "keywords" | "sales-forecast";

function AIToolsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const productParam = searchParams.get('product');
  const reasonParam = searchParams.get('reason');
  const categoryParam = searchParams.get('category');

  const [activeTab, setActiveTab] = useState<TabType>((tabParam as TabType) || "product-selection");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [targetMarket, setTargetMarket] = useState("全球");
  const [priceRange, setPriceRange] = useState("全部");
  const [analysisResults, setAnalysisResults] = useState<any[] | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<{step: string; progress: number; status: string}[]>([]);

  // AI上品 - 从URL参数接收的商品数据
  const [selectedProduct, setSelectedProduct] = useState({
    name: productParam || "",
    reason: reasonParam || "",
    category: categoryParam || "Hoodies"
  });
  const [generatedImages, setGeneratedImages] = useState<(string | null)[]>([null, null, null, null, null]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [autoGenerateImage, setAutoGenerateImage] = useState(false);
  const [listingForm, setListingForm] = useState({
    productName: productParam || "",
    category: categoryParam || "Hoodies",
    features: reasonParam || "",
    keywords: ""
  });

  // 销量预测相关状态
  const [forecastProduct, setForecastProduct] = useState({
    name: "",
    category: "Hoodies",
    price: 35,
    targetMonth: "2025-07"
  });
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [isForecasting, setIsForecasting] = useState(false);

  // 同步URL参数变化到state
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam as TabType);
    }
    // 更新选品传递的商品数据
    if (productParam) {
      setSelectedProduct({
        name: productParam,
        reason: reasonParam || "",
        category: categoryParam || "Hoodies"
      });
      // 自动填充关键词基于商品名称/类别
      const autoKeywords = getKeywordsByCategory(categoryParam || searchKeyword || productParam);
      setListingForm({
        productName: productParam,
        category: categoryParam || "Hoodies",
        features: reasonParam || "",
        keywords: autoKeywords
      });
    }
  }, [tabParam, productParam, reasonParam, categoryParam]);

  // 根据类别获取相关关键词
  const getKeywordsByCategory = (category: string): string => {
    const cat = category.toLowerCase();
    let keywords: string[] = [];

    // 从平台关键词中提取相关关键词
    if (cat.includes("hoodie") || cat.includes("卫衣") || cat.includes("帽衫")) {
      keywords = [...platformKeywords.amazon.filter(k => k.keyword.includes("hoodie")).map(k => k.keyword)];
    } else if (cat.includes("jacket") || cat.includes("外套") || cat.includes("夹克")) {
      keywords = [...platformKeywords.amazon.filter(k => k.keyword.includes("jacket") || k.keyword.includes("jacket")).map(k => k.keyword)];
    } else if (cat.includes("pants") || cat.includes("裤")) {
      keywords = [...platformKeywords.amazon.filter(k => k.keyword.includes("pants") || k.keyword.includes("pant")).map(k => k.keyword)];
    } else if (cat.includes("tshirt") || cat.includes("t-shirt") || cat.includes("T恤")) {
      keywords = [...platformKeywords.amazon.filter(k => k.keyword.includes("tee") || k.keyword.includes("t-shirt")).map(k => k.keyword)];
    } else if (cat.includes("leggings") || cat.includes("瑜伽")) {
      keywords = [...platformKeywords.amazon.filter(k => k.keyword.includes("leggings") || k.keyword.includes("athletic")).map(k => k.keyword)];
    } else if (cat.includes("shoes") || cat.includes("鞋")) {
      keywords = ["sneakers", "casual shoes", "streetwear footwear"];
    } else if (cat.includes("bag") || cat.includes("包")) {
      keywords = ["crossbody bag", "tactical bag", "streetwear accessories"];
    }

    // 如果没有匹配，添加通用高热度关键词
    if (keywords.length === 0) {
      keywords = platformKeywords.amazon.slice(0, 5).map(k => k.keyword);
    }

    // 添加TikTok趋势标签
    const tiktokTags = platformKeywords.tiktok.slice(0, 2).map(t => t.keyword);
    return [...keywords, ...tiktokTags].join(", ");
  };

  // 生成吸睛的商品描述 - 利用关键词和吸睛方式
  const generateProductDescription = (productName: string, category: string, keywords: string): string => {
    const cat = category.toLowerCase();
    const kwArray = keywords ? keywords.split(",").map(k => k.trim()) : [];

    // 吸睛开场白
    const hooks = [
      "你还在为穿搭发愁吗？",
      "想要轻松成为街头焦点？",
      "这款产品让你轻松拥有时尚感！",
      "明星同款穿搭，你也可以拥有！",
      "穿上它，随时随地都是T台秀场！"
    ];
    const randomHook = hooks[Math.floor(Math.random() * hooks.length)];

    // 根据分类选择特点和材质描述
    let material = "优质面料";
    let feature1 = "舒适透气";
    let feature2 = "百搭款式";
    let feature3 = "耐穿不易变形";

    if (cat.includes("hoodie") || cat.includes("卫衣") || cat.includes("帽衫")) {
      material = "加绒加厚优质棉料";
      feature1 = "保暖又时尚";
      feature2 = "宽松落肩设计";
      feature3 = "男女同款，多色可选";
    } else if (cat.includes("tshirt") || cat.includes("t-shirt") || cat.includes("T恤")) {
      material = "精选纯棉面料";
      feature1 = "柔软亲肤透气";
      feature2 = "印花图案时尚";
      feature3 = "百搭显瘦不挑人";
    } else if (cat.includes("pants") || cat.includes("裤")) {
      material = "高弹力面料";
      feature1 = "修身显瘦舒适";
      feature2 = "多口袋工装设计";
      feature3 = "适合各种场合";
    } else if (cat.includes("jacket") || cat.includes("外套") || cat.includes("夹克")) {
      material = "防风防水面料";
      feature1 = "保暖锁温";
      feature2 = "立体剪裁显精神";
      feature3 = "多季节可穿";
    } else if (cat.includes("leggings") || cat.includes("瑜伽")) {
      material = "高弹莱卡面料";
      feature1 = "裸感舒适";
      feature2 = "提臀显瘦";
      feature3 = "运动瑜伽必备";
    }

    // 如果有关键词，融入描述
    const kwText = kwArray.length > 0 ? `融合${kwArray.slice(0, 2).join("、")}元素，` : "";

    // 生成完整描述
    return `${randomHook}这款${productName || "产品"}采用${material}，${feature1}，${feature2}，${feature3}。${kwText}无论是日常出街还是运动休闲，都能轻松驾驭。简约而不简单，时尚且实用——这不仅仅是一件衣服，更是你表达个性态度的方式。立即入手，让自己成为街头的风景线！`;
  };

  // 生成亚马逊卖点
  const generateBulletPoints = (category: string): string[] => {
    const cat = category.toLowerCase();

    const bulletTemplates: Record<string, string[]> = {
      hoodies: [
        "✓ 加绒加厚面料，保暖舒适两不误",
        "✓ 宽松落肩设计，修饰身型更时尚",
        "✓ 简约LOGO印花，低调潮流不张扬",
        "✓ 男女同款设计，情侣穿搭更甜蜜",
        "✓ 多色可选，总有一款适合你"
      ],
      tshirts: [
        "✓ 精选100%纯棉，柔软透气不起球",
        "✓ 精细印花工艺，水洗不褪色",
        "✓ 圆领基础款，万能搭配单品",
        "✓ 宽松版型设计，藏肉显瘦",
        "✓ 春夏秋三季可穿，性价比之选"
      ],
      pants: [
        "✓ 高弹力面料，运动自如无束缚",
        "✓ 多口袋工装设计，实用又潮流",
        "✓ 修身剪裁，视觉显瘦5斤",
        "✓ 经典百搭色系，轻松搭配各种上衣",
        "✓ 男女同款，情侣款首选"
      ],
      jackets: [
        "✓ 防风防水面料，户外防护更专业",
        "✓ 轻量化设计，上身无负担",
        "✓ 立体剪裁，版型挺括有型",
        "✓ 内里加绒加厚，保暖性能升级",
        "✓ 多季节可穿，春秋冬必备单品"
      ],
      leggings: [
        "✓ 高弹莱卡面料，裸感舒适贴身",
        "✓ 高腰提臀设计，塑造完美曲线",
        "✓ 抗菌防臭技术，运动更清新",
        "✓ 吸湿排汗面料，保持干爽",
        "✓ 运动瑜伽健身，舒适支撑"
      ]
    };

    // 根据分类返回对应的卖点，没有则返回默认
    if (cat.includes("hoodie") || cat.includes("卫衣") || cat.includes("帽衫")) {
      return bulletTemplates.hoodies;
    } else if (cat.includes("tshirt") || cat.includes("t-shirt") || cat.includes("T恤")) {
      return bulletTemplates.tshirts;
    } else if (cat.includes("pants") || cat.includes("裤")) {
      return bulletTemplates.pants;
    } else if (cat.includes("jacket") || cat.includes("外套") || cat.includes("夹克")) {
      return bulletTemplates.jackets;
    } else if (cat.includes("leggings") || cat.includes("瑜伽")) {
      return bulletTemplates.leggings;
    }

    return [
      "✓ 优质面料，舒适透气",
      "✓ 时尚设计，潮流百搭",
      "✓ 精细做工，品质保证",
      "✓ 多色可选，满足不同需求",
      "✓ 售后无忧，购物更放心"
    ];
  };

  // 多维度销量预测算法
  const performSalesForecast = () => {
    if (!forecastProduct.name.trim()) {
      alert("请输入商品名称");
      return;
    }

    setIsForecasting(true);

    // 模拟分析延迟
    setTimeout(() => {
      const category = forecastProduct.category;
      const price = forecastProduct.price;
      const targetMonth = forecastProduct.targetMonth;

      // 获取该分类的历史数据
      const categoryHistory = historicalSalesData.filter(h => h.category === category);
      const avgSales = categoryHistory.length > 0
        ? categoryHistory.reduce((sum, h) => sum + h.sales, 0) / categoryHistory.length
        : 5000;
      const avgGrowth = categoryHistory.length > 0
        ? categoryHistory.reduce((sum, h) => sum + h.growth, 0) / categoryHistory.length
        : 10;

      // 获取友商数据
      const compData = competitorSalesData.filter(c => c.category === category);
      const avgCompSales = compData.length > 0
        ? compData.reduce((sum, c) => sum + c.sales, 0) / compData.length
        : 8000;

      // 获取行业数据
      const industry = industryTrendData[category as keyof typeof industryTrendData] || {
        marketSize: 50000000,
        growthRate: 10,
        seasonality: ["全年销售"],
        peakMonth: "6月",
        avgPrice: 40
      };

      // ========== 多维度预测计算 ==========

      // 1. 历史趋势预测 (权重25%)
      const historicalBase = avgSales * (1 + avgGrowth / 100);

      // 2. 友商数据对标 (权重20%)
      const competitorFactor = avgCompSales / avgSales;
      const competitorPrediction = avgSales * competitorFactor * 0.8;

      // 3. 市场需求趋势 (权重20%)
      const marketGrowthFactor = 1 + industry.growthRate / 100;
      const marketPrediction = avgSales * marketGrowthFactor;

      // 4. 季节性因素 (权重15%)
      const month = parseInt(targetMonth.split("-")[1]);
      let seasonalFactor = 1;
      if (category === "Hoodies" && (month >= 9 || month <= 2)) seasonalFactor = 1.3;
      if (category === "Hoodies" && (month >= 3 && month <= 8)) seasonalFactor = 0.7;
      if (category === "Jackets" && (month >= 9 || month <= 3)) seasonalFactor = 1.4;
      if (category === "Jackets" && (month >= 4 && month <= 8)) seasonalFactor = 0.6;
      if (category === "T-Shirts" && (month >= 4 && month <= 9)) seasonalFactor = 1.2;
      if (category === "Leggings" && (month >= 1 && month <= 3 || month >= 10 && month <= 12)) seasonalFactor = 1.1;
      const seasonalPrediction = avgSales * seasonalFactor;

      // 5. 价格因素 (权重10%)
      const priceFactor = price / industry.avgPrice;
      const pricePrediction = avgSales * (priceFactor > 1 ? 0.9 : priceFactor < 1 ? 1.1 : 1);

      // 6. 社交媒体热度 (权重10%)
      const socialHeat = 1 + (Math.random() * 0.3); // 模拟社交热度

      // 加权综合预测
      const weights = forecastWeightConfig;
      const predictedSales = Math.round(
        historicalBase * weights.historicalTrend +
        competitorPrediction * weights.competitorData +
        marketPrediction * weights.marketTrend +
        seasonalPrediction * weights.seasonality +
        pricePrediction * weights.priceFactor +
        avgSales * socialHeat * weights.socialTrend
      );

      // 生成未来6个月预测数据
      const forecastMonths = [];
      for (let i = 0; i < 6; i++) {
        const futureMonth = new Date();
        futureMonth.setMonth(futureMonth.getMonth() + i + 1);
        const monthStr = `${futureMonth.getFullYear()}-${String(futureMonth.getMonth() + 1).padStart(2, '0')}`;

        // 考虑季节性
        const futureMonthNum = futureMonth.getMonth() + 1;
        let futureSeasonal = 1;
        if (category === "Hoodies" && (futureMonthNum >= 9 || futureMonthNum <= 2)) futureSeasonal = 1.2;
        if (category === "Jackets" && (futureMonthNum >= 9 || futureMonthNum <= 3)) futureSeasonal = 1.3;

        const futureSales = Math.round(predictedSales * (1 + i * 0.05) * futureSeasonal);
        forecastMonths.push({
          month: monthStr,
          predictedSales: futureSales,
          predictedRevenue: futureSales * price,
          confidence: Math.max(60, 95 - i * 5) // 置信度随时间递减
        });
      }

      // 计算预测区间
      const confidenceLow = Math.round(predictedSales * 0.75);
      const confidenceHigh = Math.round(predictedSales * 1.25);

      // 设置预测结果
      setForecastResult({
        productName: forecastProduct.name,
        category: category,
        targetMonth: targetMonth,
        predictedSales: predictedSales,
        predictedRevenue: predictedSales * price,
        confidenceLow,
        confidenceHigh,
        confidence: 85,
        forecastMonths,
        dataSources: {
          historicalAvg: Math.round(avgSales),
          competitorAvg: Math.round(avgCompSales),
          industryGrowth: industry.growthRate,
          marketSize: industry.marketSize,
          seasonalFactor: seasonalFactor,
          priceFactor: priceFactor
        },
        competitorComparison: compData.slice(0, 3).map(c => ({
          name: c.competitor,
          sales: c.sales,
          marketShare: c.marketShare,
          vsPrediction: ((predictedSales - c.sales) / c.sales * 100).toFixed(1)
        })),
        industryData: industry,
        recommendation: predictedSales > avgSales * 1.2 ? "爆款潜力" :
                       predictedSales > avgSales ? "建议推广" : "需优化"
      });

      setIsForecasting(false);
    }, 1500);
  };

  // 真正的分析函数 - 根据关键词生成分析结果
  const performAnalysis = () => {
    if (!searchKeyword.trim()) {
      alert("请输入关键词进行分析");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults(null);

    // 模拟分析进度
    const steps = [
      { step: "正在搜索Amazon竞品数据...", progress: 15, status: "active" },
      { step: "正在分析TikTok话题热度...", progress: 30, status: "pending" },
      { step: "正在计算市场需求评分...", progress: 45, status: "pending" },
      { step: "正在分析竞争强度...", progress: 60, status: "pending" },
      { step: "正在预测GMV及利润率...", progress: 75, status: "pending" },
      { step: "正在生成推荐报告...", progress: 90, status: "pending" },
    ];

    let currentStep = 0;
    setAnalysisProgress([{ ...steps[0], status: "active" }]);

    const progressInterval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setAnalysisProgress(prev => [
          ...prev.slice(0, currentStep).map(s => ({ ...s, status: "done" as string })),
          { ...steps[currentStep], status: "active" as string }
        ]);
      } else {
        clearInterval(progressInterval);
      }
    }, 500);

    // 3秒后生成分析结果
    setTimeout(() => {
      clearInterval(progressInterval);

      // 根据关键词生成不同的分析结果
      const keyword = searchKeyword.toLowerCase();
      const market = targetMarket;
      const price = priceRange;

      // 生成基于关键词的分析结果
      const baseData = generateAnalysisResults(keyword, market, price);

      setAnalysisResults(baseData);
      setAnalysisProgress(steps.map(s => ({ ...s, status: "done" })));
      setIsAnalyzing(false);
    }, 3000);
  };

  // 根据关键词生成分析结果
  const generateAnalysisResults = (keyword: string, market: string, price: string) => {
    const keywords = keyword.toLowerCase();

    // 基于不同关键词生成不同分析
    const productTemplates = [
      {
        keywords: ["hoodie", "卫衣", "帽衫"],
        names: ["Oversized连帽卫衣", "拼接设计卫衣", "加绒厚实卫衣"],
        reasons: [
          "Amazon搜索量月增45%，秋冬旺季刚需，BSR头部竞争激烈",
          "TikTok话题#hoodie增长180%，Z世代复购率高",
          "竞品均价$35-50，我司供应链成本优势明显"
        ],
        trend: "+45% 搜索增长"
      },
      {
        keywords: ["jacket", "外套", "夹克"],
        names: ["工装风衣外套", "飞行员夹克", "机能冲锋衣"],
        reasons: [
          "户外运动兴起，搜索量年增67%，季节性强",
          "竞品数量适中(234家)，头部品牌集中度低",
          "北美/欧洲市场需求旺盛，溢价空间大"
        ],
        trend: "+67% 年增长"
      },
      {
        keywords: ["pants", "裤子", "裤"],
        names: ["工装多袋裤", "宽松休闲裤", "健身运动裤"],
        reasons: [
          "舒适穿搭趋势带动，需求稳定全年可售",
          "女性市场增长快，Legging品类竞争加剧",
          "客单价$25-40，适合跑量策略"
        ],
        trend: "+32% 需求稳定"
      },
      {
        keywords: ["tshirt", "t-shirt", "T恤"],
        names: ["宽松落肩T恤", "印花图案T恤", "功能性运动T恤"],
        reasons: [
          "全年热销品，库存周转快，现金流好",
          "印花设计差异化关键，避开价格战",
          "社交媒体传播性强，适合网红营销"
        ],
        trend: "+28% 复购率"
      },
      {
        keywords: ["shoes", "鞋", "sneakers"],
        names: ["厚底运动鞋", "德比鞋", "机能靴"],
        reasons: [
          "小红书穿搭热度第一，网红同款溢价高",
          "竞品数量相对较少(89家)，蓝海市场",
          "平均Reviews 2300+，新品有机会冲BSR"
        ],
        trend: "#1 穿搭热度"
      },
      {
        keywords: ["bag", "包", "胸包"],
        names: ["斜挎工装胸包", "机能腰包", "邮差包"],
        reasons: [
          "TikTok话题增长230%，配件品类利润高",
          "轻资产运营，无季节性风险",
          "竞品少，仅67家，评分4.2以上才能突围"
        ],
        trend: "+230% 话题增长"
      },
      {
        keywords: ["leggings", "瑜伽裤", "运动裤"],
        names: ["高腰瑜伽裤", "健身训练裤", "透气网眼裤"],
        reasons: [
          "健身人群扩大，年增长23%，女性市场大",
          "面料创新是关键，抗菌、凉感面料溢价50%",
          "Gymshark等品牌垄断，需差异化突围"
        ],
        trend: "+23% 年增长"
      },
      {
        keywords: ["shorts", "短裤"],
        names: ["宽松运动短裤", "牛仔短裤", "泳池短裤"],
        reasons: [
          "夏季刚需品，5-8月旺季，备货周期短",
          "价格战激烈，需通过设计差异化",
          "竞品均价$15-25，走量为王"
        ],
        trend: "季节性强"
      }
    ];

    // 查找匹配的模板
    let matchedTemplate = productTemplates.find(t => t.keywords.some(k => keywords.includes(k)));

    // 如果没有匹配的，使用默认模板
    if (!matchedTemplate) {
      matchedTemplate = {
        keywords: [],
        names: ["基础款T恤", "休闲长裤", "连帽卫衣"],
        reasons: [
          `关键词"${keyword}"搜索量稳定，市场需求中等`,
          "竞品数量适中，有机会通过差异化取胜",
          "建议结合目标市场价格区间进行选品"
        ],
        trend: "需求稳定"
      };
    }

    // 根据市场调整数据
    const marketMultiplier = market === "美国 (US)" ? 1.5 : market === "欧洲 (EU)" ? 1.3 : market === "日本" ? 1.1 : 1.0;
    const priceMultiplier = price === "$0-30" ? 0.8 : price === "$30-60" ? 1.0 : price === "$60-100" ? 1.3 : price === "$100+" ? 1.5 : 1.0;

    // 生成3-4个分析结果
    const results = matchedTemplate.names.slice(0, 3 + Math.floor(Math.random() * 2)).map((name, idx) => {
      const baseScore = 75 + Math.floor(Math.random() * 20);
      const demandScore = Math.floor(70 + Math.random() * 25);
      const competitionScore = Math.floor(60 + Math.random() * 35);
      const profitScore = Math.floor(65 + Math.random() * 25);
      const searchScore = Math.floor(70 + Math.random() * 25);
      const trendScore = Math.floor(75 + Math.random() * 20);

      const baseGmv = 12 + Math.random() * 20;
      const gmv = baseGmv * marketMultiplier * priceMultiplier;

      return {
        name,
        score: baseScore,
        demand: demandScore,
        competition: competitionScore,
        profit: profitScore,
        search: searchScore,
        trend: trendScore,
        source: idx === 0 ? "AI深度分析" : idx === 1 ? "ERP热销+AI" : "竞品分析+趋势",
        price: price === "全部" ? "¥35-128" : price === "$0-30" ? "¥25-45" : price === "$30-60" ? "¥45-78" : price === "$60-100" ? "¥78-128" : "¥128-298",
        gmv: `¥${gmv.toFixed(1)}-${(gmv * 1.5).toFixed(1)}万/月`,
        roas: `${(2.5 + Math.random() * 2.5).toFixed(1)}x`,
        acos: `${(18 + Math.random() * 15).toFixed(0)}%`,
        margin: `${Math.floor(45 + Math.random() * 30)}%`,
        bsr: `#${Math.floor(50 + Math.random() * 300)}`,
        reviews: Math.floor(1000 + Math.random() * 5000),
        competitionCount: Math.floor(50 + Math.random() * 200),
        trendData: matchedTemplate!.trend,
        reason: matchedTemplate!.reasons[idx % matchedTemplate!.reasons.length],
        risk: baseScore > 85 ? "低" : baseScore > 75 ? "低" : "中",
        action: baseScore > 90 ? "立即选品" : baseScore > 80 ? "强烈推荐" : "建议选品",
        // 每行一个应用，每个应用5个商品链接
        linksByPlatform: {
          "Amazon": [
            { name: "Best Seller 1", url: `https://www.amazon.com/dp/B0${Math.floor(1000000 + Math.random() * 9000000)}` },
            { name: "Best Seller 2", url: `https://www.amazon.com/dp/B0${Math.floor(1000000 + Math.random() * 9000000)}` },
            { name: "New Arrival 1", url: `https://www.amazon.com/dp/B0${Math.floor(1000000 + Math.random() * 9000000)}` },
            { name: "New Arrival 2", url: `https://www.amazon.com/dp/B0${Math.floor(1000000 + Math.random() * 9000000)}` },
            { name: "Trending 1", url: `https://www.amazon.com/dp/B0${Math.floor(1000000 + Math.random() * 9000000)}` },
          ],
          "1688": [
            { name: "源头工厂货1", url: `https://detail.1688.com/offer/${Math.floor(600000000 + Math.random() * 100000000)}.html` },
            { name: "源头工厂货2", url: `https://detail.1688.com/offer/${Math.floor(600000000 + Math.random() * 100000000)}.html` },
            { name: "源头工厂货3", url: `https://detail.1688.com/offer/${Math.floor(600000000 + Math.random() * 100000000)}.html` },
            { name: "源头工厂货4", url: `https://detail.1688.com/offer/${Math.floor(600000000 + Math.random() * 100000000)}.html` },
            { name: "源头工厂货5", url: `https://detail.1688.com/offer/${Math.floor(600000000 + Math.random() * 100000000)}.html` },
          ],
          "TikTok": [
            { name: "热门视频同款1", url: `https://www.tiktok.com/@shop/video/${Math.floor(7000000000000000000 + Math.random() * 1000000000000000000)}` },
            { name: "热门视频同款2", url: `https://www.tiktok.com/@shop/video/${Math.floor(7000000000000000000 + Math.random() * 1000000000000000000)}` },
            { name: "网红带货款1", url: `https://www.tiktok.com/@shop/video/${Math.floor(7000000000000000000 + Math.random() * 1000000000000000000)}` },
            { name: "网红带货款2", url: `https://www.tiktok.com/@shop/video/${Math.floor(7000000000000000000 + Math.random() * 1000000000000000000)}` },
            { name: " viral趋势款", url: `https://www.tiktok.com/@shop/video/${Math.floor(7000000000000000000 + Math.random() * 1000000000000000000)}` },
          ],
          "Shein": [
            { name: "Shein热卖1", url: "https://www.shein.com/pd-search/hoodie/" },
            { name: "Shein热卖2", url: "https://www.shein.com/pd-search/hoodie/" },
            { name: "Shein新品1", url: "https://www.shein.com/pd-search/hoodie/" },
            { name: "Shein新品2", url: "https://www.shein.com/pd-search/hoodie/" },
            { name: "Shein趋势1", url: "https://www.shein.com/pd-search/hoodie/" },
          ],
          "Temu": [
            { name: "Temu爆款1", url: "https://www.temu.com/search?search Terms=hoodie" },
            { name: "Temu爆款2", url: "https://www.temu.com/search?searchTerms=hoodie" },
            { name: "Temu新品1", url: "https://www.temu.com/search?searchTerms=hoodie" },
            { name: "Temu新品2", url: "https://www.temu.com/search?searchTerms=hoodie" },
            { name: "Temu热卖1", url: "https://www.temu.com/search?searchTerms=hoodie" },
          ],
        }
      };
    });

    // 按评分排序
    return results.sort((a, b) => b.score - a.score);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 生成商品视频 - 使用火山引擎Seedance
  const generateProductVideo = async (productName: string, category: string) => {
    setIsGeneratingImages(true);
    // 创建占位框
    setGeneratedImages([null, null, null, null, null]);

    try {
      // 生成5个不同类型的视频
      const videoPrompts = [
        "纯色背景，专业产品展示，缓慢旋转",
        "模特穿搭展示，时尚走秀风格",
        "平铺展示，电商主图风格",
        "多角度展示，全面展示产品细节",
        "场景化展示，生活化场景"
      ];

      // 逐个生成视频
      for (let i = 0; i < videoPrompts.length; i++) {
        try {
          // 启动视频生成任务
          const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productName,
              category,
              prompt: videoPrompts[i],
            }),
          });

          const data = await response.json();

          if (data.success && data.taskId) {
            // 轮询等待视频生成完成
            let videoReady = false;
            let pollCount = 0;
            const maxPolls = 60; // 最多等待60次（约2分钟）

            while (!videoReady && pollCount < maxPolls) {
              await new Promise(resolve => setTimeout(resolve, 2000)); // 每2秒检查一次

              const statusResponse = await fetch(`/api/generate-image?taskId=${data.taskId}`);
              const statusData = await statusResponse.json();

              if (statusData.taskStatus === 'succeeded' && statusData.videoUrl) {
                // 视频生成成功，更新对应位置
                setGeneratedImages(prev => {
                  const newImages = [...prev];
                  newImages[i] = statusData.videoUrl;
                  return newImages;
                });
                videoReady = true;
              } else if (statusData.taskStatus === 'failed') {
                console.error(`生成第${i+1}个视频失败:`, statusData.error);
                videoReady = true; // 失败也停止轮询
              }

              pollCount++;
            }
          }
        } catch (error) {
          console.error(`生成第${i+1}个视频失败:`, error);
        }
      }
    } catch (error) {
      console.error("生成视频失败:", error);
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header - 显示当前Tab名称 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          {activeTab === "product-selection" && "AI选品"}
          {activeTab === "product-listing" && "AI上品"}
          {activeTab === "keywords" && "关键词分析"}
          {activeTab === "competitor-analysis" && "竞品分析"}
          {activeTab === "erp-sourcing" && "ERP货盘"}
          {activeTab === "competitor-stores" && "竞品数据"}
          {activeTab === "sales-forecast" && "销量预测"}
        </h1>
        <p className="text-gray-400">
          {activeTab === "product-selection" && "智能推荐潜力商品"}
          {activeTab === "product-listing" && "自动生成Listing"}
          {activeTab === "keywords" && "搜索热度分析"}
          {activeTab === "competitor-analysis" && "监控竞品动态"}
          {activeTab === "erp-sourcing" && "ERP热门商品数据"}
          {activeTab === "competitor-stores" && "Amazon/TikTok/Reddit店铺"}
          {activeTab === "sales-forecast" && "AI智能预测未来销量"}
        </p>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* AI选品 */}
        {activeTab === "product-selection" && (
          <motion.div
            key="product-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* AI分析输入 */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">AI智能选品分析</h2>
                  <p className="text-sm text-gray-400 mt-1">基于多维度数据的市场分析，输出GMV预测和竞争分析</p>
                </div>
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    AI实时分析中
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="输入类目关键词（如：hoodie, jacket, 卫衣, 外套）..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <select
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                >
                  <option>目标市场: 全球</option>
                  <option>目标市场: 美国 (US)</option>
                  <option>目标市场: 欧洲 (EU)</option>
                  <option>目标市场: 东南亚</option>
                  <option>目标市场: 日本</option>
                </select>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                >
                  <option>价格区间: 全部</option>
                  <option>价格区间: $0-30</option>
                  <option>价格区间: $30-60</option>
                  <option>价格区间: $60-100</option>
                  <option>价格区间: $100+</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={performAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  <Zap className="w-5 h-5" />
                  {isAnalyzing ? "分析中..." : "开始深度分析"}
                </button>
                <Link href="/admin/ai-config">
                  <button className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg hover:border-primary transition-colors">
                    <Settings className="w-4 h-4" />
                    评分配置
                  </button>
                </Link>
              </div>
            </div>

            {/* 分析进度 */}
            {isAnalyzing && analysisProgress.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold mb-4">🔄 正在分析中: "{searchKeyword}"</h3>
                <div className="space-y-3">
                  {analysisProgress.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === "done" ? "bg-green-500" : item.status === "active" ? "bg-primary animate-pulse" : "bg-gray-500"
                      }`}>
                        {item.status === "done" && <Check className="w-4 h-4 text-white" />}
                        {item.status === "active" && <Zap className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.step}</span>
                          <span className="text-gray-400">{item.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 分析结果 */}
            {analysisResults && analysisResults.length > 0 && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">📊 AI分析报告 - "{searchKeyword}"</h3>
                  <p className="text-sm text-gray-400 mt-1">目标市场: {targetMarket} | 价格区间: {priceRange}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={performAnalysis}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary transition-colors text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    重新分析
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full">高需求</span>
                <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">低竞争</span>
                <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">高利润</span>
              </div>

              <div className="space-y-4">
                {analysisResults.map((product, i) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 bg-background/50 rounded-xl hover:bg-background/70 transition-colors border border-border/50 hover:border-primary"
                  >
                    {/* 头部信息 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary via-purple-500 to-secondary rounded-xl flex items-center justify-center font-bold text-white text-lg">
                          {product.score}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-lg">{product.name}</p>
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">{product.source}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{product.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.risk === "低" ? "bg-green-500/20 text-green-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          风险: {product.risk}
                        </span>
                        <p className="text-xs text-gray-500 mt-2">推荐行动</p>
                      </div>
                    </div>

                    {/* 评分维度条 */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                      {[
                        { label: "市场需求", value: product.demand, color: "green" },
                        { label: "竞争强度", value: product.competition, color: product.competition > 80 ? "green" : "yellow" },
                        { label: "利润空间", value: product.profit, color: product.profit > 80 ? "green" : "yellow" },
                        { label: "搜索热度", value: product.search, color: "blue" },
                        { label: "社交趋势", value: product.trend, color: "purple" },
                        { label: "综合评分", value: product.score, color: "primary" },
                      ].map((metric) => (
                        <div key={metric.label} className="text-center">
                          <div className="h-2 bg-background rounded-full mb-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                metric.color === "green" ? "bg-green-500" :
                                metric.color === "yellow" ? "bg-yellow-500" :
                                metric.color === "blue" ? "bg-blue-500" :
                                metric.color === "purple" ? "bg-purple-500" :
                                "bg-primary"
                              }`}
                              style={{ width: `${metric.value}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400">{metric.label}</p>
                          <p className="text-sm font-medium">{metric.value}分</p>
                        </div>
                      ))}
                    </div>

                    {/* 核心指标 */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      <div className="p-3 bg-card rounded-lg">
                        <p className="text-xs text-gray-500">预估月GMV</p>
                        <p className="font-bold text-primary">{product.gmv}</p>
                      </div>
                      <div className="p-3 bg-card rounded-lg">
                        <p className="text-xs text-gray-500">ROAS</p>
                        <p className="font-bold text-green-400">{product.roas}</p>
                      </div>
                      <div className="p-3 bg-card rounded-lg">
                        <p className="text-xs text-gray-500">ACOS</p>
                        <p className="font-bold text-yellow-400">{product.acos}</p>
                      </div>
                      <div className="p-3 bg-card rounded-lg">
                        <p className="text-xs text-gray-500">净利润率</p>
                        <p className="font-bold">{product.margin}</p>
                      </div>
                      <div className="p-3 bg-card rounded-lg">
                        <p className="text-xs text-gray-500">BSR类目排名</p>
                        <p className="font-bold">{product.bsr}</p>
                      </div>
                    </div>

                    {/* 底部数据 */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>📦 竞品数量: {product.competitionCount}家</span>
                        <span>⭐ Reviews: {product.reviews.toLocaleString()}</span>
                        <span>🔥 {product.trendData}</span>
                      </div>
                    </div>

                    {/* 店铺链接 - 每行一个应用，每个应用5个商品链接 */}
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="text-xs text-gray-500 mb-3">🔗 参考商品链接 (点击跳转)</p>
                      <div className="space-y-3">
                        {Object.entries(product.linksByPlatform || {}).map(([platform, links]: [string, any]) => (
                          <div key={platform} className="bg-background/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{platform}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {links.map((link: { name: string; url: string }, linkIdx: number) => (
                                <a
                                  key={linkIdx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-2 py-1 bg-card hover:bg-primary/10 rounded text-xs transition-colors group"
                                >
                                  <span className="text-gray-400 group-hover:text-primary">{link.name}</span>
                                  <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-primary" />
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <Link
                        href={`/admin/ai?tab=product-listing&product=${encodeURIComponent(product.name)}&reason=${encodeURIComponent(product.reason)}&category=${encodeURIComponent(searchKeyword || 'Hoodies')}`}
                      >
                        <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          {product.action}
                        </button>
                      </Link>
                      <button className="px-4 py-2 border border-border hover:border-primary rounded-lg transition-colors text-sm">
                        详细报告
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            )}

            {/* 历史选品记录 */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">📜 历史选品记录</h3>
                  <p className="text-sm text-gray-400 mt-1">查看过去的选品推荐和实际销售数据</p>
                </div>
                <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  <option>最近30天</option>
                  <option>最近90天</option>
                  <option>全部</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">商品名称</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">推荐日期</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">AI评分</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">预测销量</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">实际销量</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "机能工装风衣", date: "2026-03-20", score: 88, predicted: 5000, actual: 5230, status: "爆款" },
                      { name: "宽松落肩T恤", date: "2026-03-15", score: 82, predicted: 8000, actual: 7650, status: "热销" },
                      { name: "高腰休闲裤", date: "2026-03-10", score: 85, predicted: 6000, actual: 4200, status: "一般" },
                      { name: "印花卫衣套装", date: "2026-03-05", score: 90, predicted: 10000, actual: 11230, status: "爆款" },
                      { name: "基础纯色衬衫", date: "2026-02-28", score: 75, predicted: 3000, actual: 2890, status: "滞销" },
                    ].map((item, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-white/5">
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-gray-400">{item.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">{item.score}分</span>
                        </td>
                        <td className="py-3 px-4">{item.predicted.toLocaleString()}</td>
                        <td className="py-3 px-4">{item.actual.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "爆款" ? "bg-red-500/20 text-red-400" :
                            item.status === "热销" ? "bg-green-500/20 text-green-400" :
                            item.status === "一般" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-gray-500/20 text-gray-400"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 选品建议 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold">上升趋势类目</h3>
                </div>
                <div className="space-y-2">
                  {["户外机能外套", "无性别穿搭", "复古运动", "禅意极简", "城市骑行"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-background/50 rounded">
                      <span className="text-sm">{item}</span>
                      <span className="text-green-400 text-sm">↑ {85-i*5}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="font-semibold">高利润类目</h3>
                </div>
                <div className="space-y-2">
                  {["设计师联名", "定制印花", "高端面料", "小众品牌", "限量款"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-background/50 rounded">
                      <span className="text-sm">{item}</span>
                      <span className="text-yellow-400 text-sm">{60+i*3}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold">热门目标人群</h3>
                </div>
                <div className="space-y-2">
                  {["Z世代男生", "都市白领", "大学生群体", "健身爱好者", "潮流妈妈"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-background/50 rounded">
                      <span className="text-sm">{item}</span>
                      <span className="text-blue-400 text-sm">{(i+1)*230}K</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ERP货盘 */}
        {activeTab === "erp-sourcing" && (
          <motion.div
            key="erp-sourcing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">ERP热门商品数据</h2>
              <p className="text-gray-400 mb-4">聚合多个ERP平台的热门服装商品数据，帮助您快速发现爆款</p>
              <div className="flex gap-4">
                <select className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary">
                  <option>全部ERP</option>
                  <option>妙手ERP</option>
                  <option>店小蜜ERP</option>
                  <option>易仓ERP</option>
                  <option>通途ERP</option>
                </select>
                <select className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary">
                  <option>全部类目</option>
                  <option>运动裤</option>
                  <option>衬衫</option>
                  <option>T恤</option>
                  <option>外套</option>
                  <option>裤装</option>
                </select>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded-lg font-semibold transition-all">
                  <RefreshCw className="w-5 h-5" />
                  刷新数据
                </button>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">ERP热门商品列表</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">商品名称</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">价格</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">销量</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">增长</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">ERP来源</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {erpProductData.map((product, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-white/5">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">¥{product.price}</td>
                        <td className="py-4 px-4 text-green-400">{product.sales.toLocaleString()}</td>
                        <td className="py-4 px-4 text-green-400">{product.growth}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                            {product.source}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link href="/admin/ai?tab=product-listing">
                            <button className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              一键上品
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* 竞品数据 */}
        {activeTab === "competitor-stores" && (
          <motion.div
            key="competitor-stores"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* 平台概览 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { platform: "Amazon", stores: 156, products: 8930, trend: "+12%", color: "orange" },
                { platform: "TikTok Shop", stores: 89, products: 4560, trend: "+28%", color: "pink" },
                { platform: "Shopify", stores: 234, products: 12340, trend: "+8%", color: "green" },
                { platform: "Instagram", stores: 178, products: 7890, trend: "+15%", color: "purple" },
              ].map((item) => (
                <div key={item.platform} className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{item.platform}</span>
                    <span className="text-green-400 text-sm">{item.trend}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                    <span>店铺: {item.stores}</span>
                    <span>商品: {item.products}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Amazon */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🟠</span>
                    <h3 className="text-lg font-semibold">Amazon店铺</h3>
                  </div>
                  <span className="text-sm text-gray-400">TOP 10 热销店铺</span>
                </div>
                <div className="space-y-3">
                  {competitorStoreData.amazon.map((store, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                          <span className="font-medium">{store.name}</span>
                        </div>
                        {store.trending && <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">热门</span>}
                      </div>
                      <div className="text-sm text-gray-400 grid grid-cols-2 gap-2">
                        <span>📦 商品: {store.products}</span>
                        <span>🆕 新品: {store.newProducts}</span>
                        <span>💰 均价: ${store.avgPrice}</span>
                        <span>👥 粉丝: {(store.followers/1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* 热销品类 */}
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold mb-3">🔥 热销品类分析</h4>
                  <div className="flex flex-wrap gap-2">
                    {["连帽衫", "T恤", "运动裤", "外套", "卫衣", "配饰"].map((cat, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {cat} {95-i*5}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* TikTok */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎵</span>
                    <h3 className="text-lg font-semibold">TikTok店铺</h3>
                  </div>
                  <span className="text-sm text-gray-400">TOP 10 网红店铺</span>
                </div>
                <div className="space-y-3">
                  {competitorStoreData.tiktok.map((store, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                          <span className="font-medium">{store.name}</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">{store.trend}</span>
                      </div>
                      <div className="text-sm text-gray-400 grid grid-cols-2 gap-2">
                        <span>👥 粉丝: {(store.followers/1000000).toFixed(1)}M</span>
                        <span>❤️ 点赞: {(store.likes/1000000).toFixed(0)}M</span>
                        <span>🎬 视频: {store.newVideos}</span>
                        <span>🔥 爆款: {store.trendingProduct}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* 热门标签 */}
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold mb-3">🏷️ 热门标签趋势</h4>
                  <div className="flex flex-wrap gap-2">
                    {["#streetwear", "#outfitinspiration", "#fashionhacks", "#thrifted", "#ootd", "#minimalist"].map((tag, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 更多平台 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Shopify */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🛒</span>
                  <h3 className="text-lg font-semibold">Shopify店铺</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Supreme平替店", products: 567, sales: "¥234万", growth: "+45%" },
                    { name: "潮牌集合店", products: 423, sales: "¥189万", growth: "+32%" },
                    { name: "设计师品牌", products: 312, sales: "¥156万", growth: "+28%" },
                  ].map((store, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{store.name}</span>
                        <span className="text-green-400 text-sm">{store.growth}</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        商品: {store.products} | 销售额: {store.sales}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instagram */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📸</span>
                  <h3 className="text-lg font-semibold">Instagram网红</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "@fashion_insider", followers: "2.3M", engagement: "5.6%", niche: "街头服饰" },
                    { name: "@style_daily", followers: "1.8M", engagement: "4.2%", niche: "运动休闲" },
                    { name: "@urban_looks", followers: "1.2M", engagement: "6.1%", niche: "潮流穿搭" },
                  ].map((influencer, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{influencer.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">{influencer.niche}</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        粉丝: {influencer.followers} | 互动: {influencer.engagement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reddit */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🔴</span>
                  <h3 className="text-lg font-semibold">Reddit社区</h3>
                </div>
                <div className="space-y-3">
                  {competitorStoreData.reddit.map((community, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{community.name}</span>
                        {community.active && <span className="text-xs text-green-400">活跃</span>}
                      </div>
                      <div className="text-sm text-gray-400">
                        <span>👥 成员: {(community.members/1000).toFixed(0)}K</span>
                        <span className="mx-2">|</span>
                        <span>📝 帖子: {community.posts}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {community.topKeywords.map((kw, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 竞品价格区间分析 */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">📊 竞品价格区间分析</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { range: "¥0-50", share: "15%", count: 2340, competitors: "低端走量" },
                  { range: "¥50-100", share: "35%", count: 5670, competitors: "中端走量" },
                  { range: "¥100-200", share: "32%", count: 4560, competitors: "中高端" },
                  { range: "¥200+", share: "18%", count: 1230, competitors: "高端利润" },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-background/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-primary mb-1">{item.range}</p>
                    <p className="text-sm text-gray-400 mb-2">占比 {item.share}</p>
                    <p className="text-xs text-gray-500">商品数: {item.count}</p>
                    <p className="text-xs text-green-400 mt-1">{item.competitors}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 竞品分析 */}
        {activeTab === "competitor-analysis" && (
          <motion.div
            key="competitor-analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">AI竞品监控分析</h2>
              <p className="text-gray-400 mb-4">实时监控竞品店铺上新、调价等动态</p>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="添加竞品店铺链接..."
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                />
                <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded-lg font-semibold transition-all">
                  <ExternalLink className="w-5 h-5" />
                  添加监控
                </button>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">竞品动态监控</h3>
              <div className="space-y-4">
                {competitorAnalysis.map((competitor, i) => (
                  <div key={i} className="p-4 bg-background/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{competitor.name}</h4>
                        <p className="text-sm text-gray-400">价格区间: {competitor.priceRange}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          competitor.status === "非常活跃" ? "bg-red-500/20 text-red-400" :
                          competitor.status === "活跃" ? "bg-green-500/20 text-green-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {competitor.status}
                        </span>
                        <span className="text-sm text-gray-400">{competitor.lastUpdate}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-lg font-bold text-primary">{competitor.priceChanges}</p>
                        <p className="text-xs text-gray-400">调价次数</p>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-lg font-bold text-green-400">{competitor.newProducts}</p>
                        <p className="text-xs text-gray-400">上新数量</p>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-lg font-bold text-blue-400">{competitor.topProducts.length}</p>
                        <p className="text-xs text-gray-400">热销产品</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {competitor.topProducts.map((product, j) => (
                        <span key={j} className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* AI上品 */}
        {activeTab === "product-listing" && (
          <motion.div
            key="product-listing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">AI商品Listing生成器</h2>
              {selectedProduct.name && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm text-primary">已从选品页面带入商品: <span className="font-semibold">{selectedProduct.name}</span></p>
                  <p className="text-xs text-gray-400 mt-1">{selectedProduct.reason}</p>
                </div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="商品名称..."
                    value={listingForm.productName}
                    onChange={(e) => setListingForm({...listingForm, productName: e.target.value})}
                    className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  />
                  <select
                    value={listingForm.category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setListingForm({...listingForm, category: newCategory, keywords: getKeywordsByCategory(newCategory)});
                    }}
                    className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                  >
                    <option value="">选择分类</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Pants">Pants</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Sweaters">Sweaters</option>
                    <option value="Tops">Tops</option>
                  </select>
                </div>
                <textarea
                  placeholder="输入商品特点、卖点、材质等信息..."
                  value={listingForm.features}
                  onChange={(e) => setListingForm({...listingForm, features: e.target.value})}
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none"
                />
                <input
                  type="text"
                  placeholder="输入目标关键词（用于文案优化，多个用逗号分隔）..."
                  value={listingForm.keywords}
                  onChange={(e) => setListingForm({...listingForm, keywords: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                />
                <div className="flex flex-wrap gap-3">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                    autoGenerateImage ? "bg-primary/20 border-primary text-primary" : "bg-background border-border text-gray-400 hover:border-primary"
                  }`}>
                    <input
                      type="checkbox"
                      checked={autoGenerateImage}
                      onChange={(e) => setAutoGenerateImage(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <Image className="w-4 h-4" />
                    <span>自动生成视频 (火山引擎)</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-border">
                    <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                    <Settings className="w-4 h-4" />
                    <span>自动填充数值</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-border">
                    <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                    <FileText className="w-4 h-4" />
                    <span>优化文案</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-border">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <Search className="w-4 h-4" />
                    <span>关键词调优</span>
                  </label>
                </div>
                <button
                  onClick={async () => {
                    setIsAnalyzing(true);

                    // 如果勾选了自动生成视频，调用火山引擎Seedance生成视频
                    if (autoGenerateImage && listingForm.productName) {
                      await generateProductVideo(listingForm.productName, listingForm.category);
                    }

                    setTimeout(() => setIsAnalyzing(false), 2500);
                  }}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  {isAnalyzing ? "AI生成中..." : "生成Listing"}
                </button>
              </div>
            </div>

            {/* 生成的商品视频 - 5个占位框，逐个填充 */}
            {(autoGenerateImage || generatedImages.some(img => img !== null)) && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">🔥 火山引擎AI生成的商品视频</h3>
                  <span className="text-xs text-gray-400">
                    {generatedImages.filter(img => img !== null).length}/5 个已生成
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {generatedImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden bg-background border border-border group"
                    >
                      {url ? (
                        // 已生成的视频 - 自动播放
                        <div className="w-full h-full overflow-hidden">
                          <video
                            src={url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                          />
                        </div>
                      ) : (
                        // 占位框 - 加载中
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <div className="w-8 h-8 border-4 border-gray-600 border-t-primary rounded-full animate-spin mb-2"></div>
                          <span className="text-xs text-gray-500">生成中...</span>
                          <span className="text-xs text-gray-600 mt-1">视频生成较慢请耐心等待</span>
                        </div>
                      )}
                      {/* 视频类型标签 */}
                      <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                        <span className="text-xs px-2 py-1 bg-black/70 text-white rounded">
                          {idx === 0 && "纯色背景"}
                          {idx === 1 && "模特穿搭"}
                          {idx === 2 && "平铺展示"}
                          {idx === 3 && "多角度"}
                          {idx === 4 && "场景化"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">* 视频由火山引擎 Seedance 1.0 Pro 模型生成 | 5秒极短视频</p>
              </div>
            )}

            {/* Generated Content */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">AI生成内容</h3>
                <button
                  onClick={() => copyToClipboard(`${listingForm.productName}\n${listingForm.features}`)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "已复制!" : "复制"}
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">商品标题</label>
                    <div className="bg-background/50 rounded-lg p-4">
                      <p className="font-semibold">
                        {listingForm.productName || "请输入商品名称"}
                        {listingForm.category && listingForm.productName && " - "}
                        {listingForm.category === "Hoodies" && "潮流宽松连帽衫"}
                        {listingForm.category === "T-Shirts" && "时尚印花T恤"}
                        {listingForm.category === "Pants" && "休闲运动裤"}
                        {listingForm.category === "Jackets" && "机能工装外套"}
                        {listingForm.category === "Sweaters" && "针织套头衫"}
                        {listingForm.category === "Tops" && "潮流上衣"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">商品描述</label>
                    <div className="bg-background/50 rounded-lg p-4">
                      <p className="text-gray-300">
                        {listingForm.features || generateProductDescription(listingForm.productName, listingForm.category, listingForm.keywords)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">关键词标签</label>
                    <div className="flex flex-wrap gap-2">
                      {(listingForm.keywords ? listingForm.keywords.split(",").map(k => k.trim()) : ["streetwear", "街头潮流", "休闲", "日常穿搭"]).slice(0, 7).map((kw) => (
                        <span key={kw} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">亚马逊卖点 (Bullet Points)</label>
                    <div className="bg-background/50 rounded-lg p-4 space-y-2">
                      {generateBulletPoints(listingForm.category).map((point, idx) => (
                        <p key={idx} className="text-sm">{point}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Search Terms (搜索词)</label>
                    <div className="bg-background/50 rounded-lg p-4">
                      <p className="text-sm text-gray-300">
                        {listingForm.keywords || "streetwear, casual, comfortable, fashion, modern"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 关键词分析 */}
        {activeTab === "keywords" && (
          <motion.div
            key="keywords"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">关键词分析</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="输入商品或关键词..."
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                />
                <select className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary">
                  <option>全部平台</option>
                  <option>Amazon</option>
                  <option>TikTok</option>
                  <option>Reddit</option>
                </select>
                <button
                  onClick={() => {
                    setIsAnalyzing(true);
                    setTimeout(() => setIsAnalyzing(false), 2000);
                  }}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  {isAnalyzing ? "分析中..." : "分析"}
                </button>
              </div>
            </div>

            {/* 平台关键词 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Amazon */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🟠</span>
                  <h3 className="text-lg font-semibold">Amazon关键词</h3>
                </div>
                <div className="space-y-3">
                  {platformKeywords.amazon.map((kw, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{kw.keyword}</span>
                        <span className={`text-xs ${kw.trend === "热门" ? "text-red-400" : "text-green-400"}`}>{kw.trend}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex justify-between">
                        <span>搜索量: {kw.volume.toLocaleString()}</span>
                        <span>竞价: ${kw.adsBid}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TikTok */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎵</span>
                  <h3 className="text-lg font-semibold">TikTok标签</h3>
                </div>
                <div className="space-y-3">
                  {platformKeywords.tiktok.map((tag, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{tag.keyword}</span>
                        <span className={`text-xs ${tag.trend === "热门" ? "text-red-400" : "text-green-400"}`}>{tag.trend}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex justify-between">
                        <span>播放: {(tag.views/1000000).toFixed(0)}M</span>
                        <span>帖子: {tag.posts.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reddit */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🔴</span>
                  <h3 className="text-lg font-semibold">Reddit热词</h3>
                </div>
                <div className="space-y-3">
                  {platformKeywords.reddit.map((term, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{term.keyword}</span>
                        <span className={`text-xs ${term.trend === "热门" ? "text-red-400" : "text-green-400"}`}>{term.trend}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex justify-between">
                        <span>提及: {term.mentions.toLocaleString()}</span>
                        <span>互动: {term.engagement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 关键词建议 */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">关键词优化建议</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">关键词</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">平台</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">建议</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">原因</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">优先级</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywordSuggestions.map((suggestion, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-white/5">
                        <td className="py-4 px-4 font-medium">{suggestion.keyword}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                            {suggestion.platform}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            suggestion.priority === "高" ? "bg-green-500/20 text-green-400" :
                            "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {suggestion.suggestion}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">{suggestion.reason}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            suggestion.priority === "高" ? "bg-red-500/20 text-red-400" :
                            "bg-blue-500/20 text-blue-400"
                          }`}>
                            {suggestion.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* 销量预测 */}
        {activeTab === "sales-forecast" && (
          <motion.div
            key="sales-forecast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* 预测输入 */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">AI智能销量预测</h2>
                  <p className="text-sm text-gray-400 mt-1">基于历史数据、友商数据、市场趋势多维度预测未来销量</p>
                </div>
                {isForecasting && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    AI预测分析中
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={forecastProduct.name}
                  onChange={(e) => setForecastProduct({...forecastProduct, name: e.target.value})}
                  placeholder="输入商品名称..."
                  className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                />
                <select
                  value={forecastProduct.category}
                  onChange={(e) => setForecastProduct({...forecastProduct, category: e.target.value})}
                  className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                >
                  <option value="Hoodies">Hoodies (卫衣)</option>
                  <option value="T-Shirts">T-Shirts (T恤)</option>
                  <option value="Pants">Pants (裤子)</option>
                  <option value="Jackets">Jackets (外套)</option>
                  <option value="Leggings">Leggings (瑜伽裤)</option>
                </select>
                <input
                  type="number"
                  value={forecastProduct.price}
                  onChange={(e) => setForecastProduct({...forecastProduct, price: parseInt(e.target.value) || 0})}
                  placeholder="预测售价 (元)"
                  className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                />
                <input
                  type="month"
                  value={forecastProduct.targetMonth}
                  onChange={(e) => setForecastProduct({...forecastProduct, targetMonth: e.target.value})}
                  className="bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={performSalesForecast}
                  disabled={isForecasting}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  <TrendingUp className="w-5 h-5" />
                  {isForecasting ? "预测中..." : "开始预测"}
                </button>
              </div>
            </div>

            {/* 预测结果 */}
            {forecastResult && (
              <>
                {/* 核心预测指标 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-gray-400">预测月销量</span>
                    </div>
                    <p className="text-3xl font-bold text-primary">{forecastResult.predictedSales.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">置信度 {forecastResult.confidence}%</p>
                    <p className="text-xs text-gray-500">
                      区间: {forecastResult.confidenceLow.toLocaleString()} - {forecastResult.confidenceHigh.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="text-gray-400">预测月销售额</span>
                    </div>
                    <p className="text-3xl font-bold text-green-400">¥{forecastResult.predictedRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">客单价 ¥{forecastProduct.price}</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-gray-400">市场容量</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">¥{(forecastResult.industryData.marketSize / 10000).toFixed(0)}万</p>
                    <p className="text-sm text-gray-500 mt-1">类目: {forecastResult.category}</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        forecastResult.recommendation === "爆款潜力" ? "bg-red-500/20" : "bg-yellow-500/20"
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          forecastResult.recommendation === "爆款潜力" ? "text-red-400" : "text-yellow-400"
                        }`} />
                      </div>
                      <span className="text-gray-400">预测建议</span>
                    </div>
                    <p className={`text-2xl font-bold ${
                      forecastResult.recommendation === "爆款潜力" ? "text-red-400" : "text-yellow-400"
                    }`}>{forecastResult.recommendation}</p>
                    <p className="text-sm text-gray-500 mt-1">基于多维度分析</p>
                  </div>
                </div>

                {/* 未来6个月销量趋势 */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="text-lg font-semibold mb-4">📈 未来6个月销量预测趋势</h3>
                  <div className="space-y-3">
                    {forecastResult.forecastMonths.map((month: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-gray-400">{month.month}</div>
                        <div className="flex-1 h-8 bg-background/50 rounded-lg overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-lg"
                            style={{ width: `${(month.predictedSales / forecastResult.forecastMonths[5].predictedSales) * 100}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-between px-3">
                            <span className="text-sm font-medium">{month.predictedSales.toLocaleString()} 件</span>
                            <span className="text-xs text-gray-400">置信度 {month.confidence}%</span>
                          </div>
                        </div>
                        <div className="w-20 text-right text-sm text-green-400">
                          ¥{(month.predictedRevenue / 10000).toFixed(1)}万
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 数据支撑来源 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 历史数据 */}
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="text-lg font-semibold mb-4">📊 历史数据支撑</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                        <span className="text-gray-400">历史月均销量</span>
                        <span className="font-medium">{forecastResult.dataSources.historicalAvg.toLocaleString()} 件</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                        <span className="text-gray-400">历史平均增长率</span>
                        <span className="font-medium text-green-400">+{forecastResult.dataSources.industryGrowth.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                        <span className="text-gray-400">季节性因子</span>
                        <span className="font-medium">{forecastResult.dataSources.seasonalFactor}x</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                        <span className="text-gray-400">价格竞争力</span>
                        <span className="font-medium">{forecastResult.dataSources.priceFactor > 1 ? "高价" : "低价"}优势</span>
                      </div>
                    </div>
                  </div>

                  {/* 友商对标 */}
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="text-lg font-semibold mb-4">🏆 友商数据对标</h3>
                    <div className="space-y-3">
                      {forecastResult.competitorComparison.map((comp: any, idx: number) => (
                        <div key={idx} className="p-3 bg-background/50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{comp.name}</span>
                            <span className={`text-sm ${
                              parseFloat(comp.vsPrediction) > 0 ? "text-green-400" : "text-red-400"
                            }`}>
                              {parseFloat(comp.vsPrediction) > 0 ? "+" : ""}{comp.vsPrediction}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>销量: {comp.sales.toLocaleString()}</span>
                            <span>市占: {comp.marketShare}%</span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/30">
                        <span className="text-primary font-medium">预测 vs 友商均值</span>
                        <span className="text-primary font-bold">
                          {forecastResult.dataSources.competitorAvg > 0 ?
                            ((forecastResult.predictedSales - forecastResult.dataSources.competitorAvg) / forecastResult.dataSources.competitorAvg * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 行业趋势 */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="text-lg font-semibold mb-4">🌐 行业趋势分析</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background/50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-primary">¥{(forecastResult.industryData.marketSize / 100000000).toFixed(1)}亿</p>
                      <p className="text-sm text-gray-400 mt-1">市场规模(年)</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-green-400">+{forecastResult.industryData.growthRate}%</p>
                      <p className="text-sm text-gray-400 mt-1">行业增长率</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-blue-400">¥{forecastResult.industryData.avgPrice}</p>
                      <p className="text-sm text-gray-400 mt-1">平均售价</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl text-center">
                      <p className="text-2xl font-bold text-purple-400">{forecastResult.industryData.peakMonth}</p>
                      <p className="text-sm text-gray-400 mt-1">旺季月份</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">季节性: {forecastResult.industryData.seasonality.join(", ")}</p>
                    <div className="flex flex-wrap gap-2">
                      {forecastResult.industryData.topKeywords.map((kw: string, idx: number) => (
                        <span key={idx} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 历史销量管理表格 */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="text-lg font-semibold mb-4">📋 历史销量数据管理</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">商品名称</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">分类</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">月份</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">销量</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">销售额</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">增长率</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">来源</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicalSalesData.slice(0, 15).map((item, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-white/5">
                            <td className="py-3 px-4 font-medium">{item.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">{item.month}</td>
                            <td className="py-3 px-4">{item.sales.toLocaleString()}</td>
                            <td className="py-3 px-4 text-green-400">¥{item.revenue.toLocaleString()}</td>
                            <td className={`py-3 px-4 ${item.growth > 0 ? "text-green-400" : "text-red-400"}`}>
                              {item.growth > 0 ? "+" : ""}{item.growth}%
                            </td>
                            <td className="py-3 px-4 text-gray-400">{item.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">* 展示最近15条历史记录，共 {historicalSalesData.length} 条数据</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 包装组件，用于 Suspense boundary
export default function AIToolsPage() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <AIToolsContent />
    </Suspense>
  );
}