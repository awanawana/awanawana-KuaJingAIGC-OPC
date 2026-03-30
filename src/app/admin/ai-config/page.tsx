"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, RotateCcw, TrendingUp, Users, DollarSign, Package, BarChart3, Search, Heart, Eye, ShoppingBag, Star, Target, Zap } from "lucide-react";

interface ScoreDimension {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  weight: number;
  maxScore: number;
  icon: string;
  enabled: boolean;
  metrics: string[];
}

const defaultDimensions: ScoreDimension[] = [
  {
    id: "market_demand",
    name: "市场需求度",
    nameEn: "Market Demand",
    description: "基于搜索量、销量增长率、社交媒体讨论热度评估",
    weight: 25,
    maxScore: 100,
    icon: "📈",
    enabled: true,
    metrics: ["Google Trends搜索趋势", "Amazon销量排名", "TikTok话题播放量", "小红书笔记数量"]
  },
  {
    id: "competition",
    name: "竞争强度",
    nameEn: "Competition Intensity",
    description: "评估竞品数量、头部集中度、价格战程度",
    weight: 20,
    maxScore: 100,
    icon: "⚔️",
    enabled: true,
    metrics: ["Amazon搜索结果数", "竞品店铺数量", "BSR排名竞争度", "价格区间分布"]
  },
  {
    id: "profit_margin",
    name: "利润空间",
    nameEn: "Profit Margin",
    description: "综合成本、售价、平台费用计算净利润率",
    weight: 20,
    maxScore: 100,
    icon: "💰",
    enabled: true,
    metrics: ["原材料成本", "物流成本", "平台佣金", "广告推广费", "退货率"]
  },
  {
    id: "search_volume",
    name: "搜索热度",
    nameEn: "Search Volume",
    description: "关键词自然搜索量和付费搜索竞价",
    weight: 15,
    maxScore: 100,
    icon: "🔍",
    enabled: true,
    metrics: ["Amazon搜索量", "Google搜索趋势", "ABA关键词热度", "CPC竞价"]
  },
  {
    id: "social_trend",
    name: "社交热度",
    nameEn: "Social Trend",
    description: "社交媒体上的讨论热度、网红带热度",
    weight: 10,
    maxScore: 100,
    icon: "🔥",
    enabled: true,
    metrics: ["TikTok播放量", "Instagram标签", "Reddit讨论", "YouTube测评视频"]
  },
  {
    id: "seasonality",
    name: "季节性",
    nameEn: "Seasonality",
    description: "产品销售的季节性特征和全年销售潜力",
    weight: 10,
    maxScore: 100,
    icon: "📅",
    enabled: true,
    metrics: ["旺季持续时间", "全年销售稳定性", "节日促销关联", "季节替代性"]
  }
];

const industryBenchmarks = {
  avgProfitMargin: { value: 35, min: 25, max: 50, unit: "%" },
  avgTurnover: { value: 45, min: 30, max: 90, unit: "天" },
  avgConversion: { value: 3.2, min: 1.5, max: 8.5, unit: "%" },
  avgRating: { value: 4.5, min: 4.0, max: 5.0, unit: "★" },
  avgROAS: { value: 3.5, min: 2.0, max: 6.0, unit: "x" },
};

export default function AIConfigPage() {
  const [dimensions, setDimensions] = useState<ScoreDimension[]>(defaultDimensions);
  const [saved, setSaved] = useState(false);

  const handleWeightChange = (id: string, newWeight: number) => {
    setDimensions(prev => prev.map(d => d.id === id ? { ...d, weight: newWeight } : d));
    setSaved(false);
  };

  const handleToggle = (id: string) => {
    setDimensions(prev => prev.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d));
    setSaved(false);
  };

  const handleReset = () => {
    setDimensions(defaultDimensions);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    // 这里可以添加保存到localStorage或API
    localStorage.setItem("aiScoringConfig", JSON.stringify(dimensions));
  };

  const totalWeight = dimensions.filter(d => d.enabled).reduce((sum, d) => sum + d.weight, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              AI选品配置
            </h1>
            <p className="text-gray-400">配置AI评分维度和权重，定制化您的选品分析逻辑</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-primary hover:bg-primary-hover text-white"
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? "已保存" : "保存配置"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Weight Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 border border-border mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">权重配置状态</h2>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            totalWeight === 100
              ? "bg-green-500/20 text-green-400"
              : totalWeight > 100
              ? "bg-red-500/20 text-red-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}>
            当前总权重: {totalWeight}% {totalWeight === 100 ? "✓" : totalWeight > 100 ? "(超出)" : "(不足)"}
          </div>
        </div>
        <div className="h-4 bg-background rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(totalWeight, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* Score Dimensions */}
      <div className="space-y-4 mb-8">
        {dimensions.map((dimension, index) => (
          <motion.div
            key={dimension.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-card rounded-2xl p-6 border border-border ${
              !dimension.enabled ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Toggle */}
              <button
                onClick={() => handleToggle(dimension.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
                  dimension.enabled
                    ? "bg-primary/20"
                    : "bg-gray-500/20"
                }`}
              >
                {dimension.icon}
              </button>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {dimension.name}
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                        {dimension.nameEn}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{dimension.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {dimension.weight}%
                    </div>
                    <div className="text-xs text-gray-500">权重</div>
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={dimension.weight}
                    onChange={(e) => handleWeightChange(dimension.id, parseInt(e.target.value))}
                    disabled={!dimension.enabled}
                    className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                </div>

                {/* Metrics */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">评估指标:</p>
                  <div className="flex flex-wrap gap-2">
                    {dimension.metrics.map((metric, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 bg-background rounded-full text-gray-400"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Industry Benchmarks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          行业基准参考
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "平均毛利率", key: "avgProfitMargin", icon: "💵" },
            { label: "平均周转天数", key: "avgTurnover", icon: "📦" },
            { label: "平均转化率", key: "avgConversion", icon: "🎯" },
            { label: "平均评分", key: "avgRating", icon: "⭐" },
            { label: "平均ROAS", key: "avgROAS", icon: "📊" },
          ].map((item) => {
            const data = industryBenchmarks[item.key as keyof typeof industryBenchmarks];
            return (
              <div
                key={item.key}
                className="p-4 bg-background/50 rounded-xl text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-xl font-bold mt-1">
                  {data.value}{data.unit}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  基准: {data.min}-{data.max}{data.unit}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Glossary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card rounded-2xl p-6 border border-border mt-6"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-secondary" />
          电商专业术语表
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { term: "GMV", full: "Gross Merchandise Volume", desc: "商品交易总额，一定时间内的成交总金额" },
            { term: "ROAS", full: "Return on Ad Spend", desc: "广告支出回报率，广告收入/广告支出" },
            { term: "ACOS", full: "Advertising Cost of Sales", desc: "广告销售成本，广告支出/广告收入" },
            { term: "BSR", full: "Best Sellers Rank", desc: "亚马逊销量排名，类目排名" },
            { term: "FBA", full: "Fulfillment by Amazon", desc: "亚马逊物流服务" },
            { term: "CPC", full: "Cost Per Click", desc: "单次点击成本" },
            { term: "CTR", full: "Click Through Rate", desc: "点击率，点击数/展示数" },
            { term: "CVR", full: "Conversion Rate", desc: "转化率，下单数/点击数" },
            { term: "LTV", full: "Lifetime Value", desc: "客户生命周期价值" },
            { term: "CAC", full: "Customer Acquisition Cost", desc: "客户获取成本" },
            { term: "SKU", full: "Stock Keeping Unit", desc: "库存量单位，商品编码" },
            { term: "ASIN", full: "Amazon Standard Identification Number", desc: "亚马逊标准识别号" },
            { term: "FNSKU", full: "Fulfillment Network SKU", desc: "亚马逊物流SKU" },
            { term: "PPC", full: "Pay Per Click", desc: "按点击付费广告" },
            { term: "SEO", full: "Search Engine Optimization", desc: "搜索引擎优化" },
          ].map((item) => (
            <div
              key={item.term}
              className="p-4 bg-background/50 rounded-xl hover:bg-background/70 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-primary">{item.term}</span>
                <span className="text-xs text-gray-500">{item.full}</span>
              </div>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}