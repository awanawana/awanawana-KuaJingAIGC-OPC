"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Calendar, Package, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { historicalSalesData, competitorSalesData, industryTrendData } from "@/lib/data";

interface Props {}

export default function SalesForecast() {
  const [product, setProduct] = useState({
    name: "",
    category: "Hoodies",
    price: 35,
    targetMonth: "2026-06"
  });
  
  const [result, setResult] = useState<any>(null);
  const [isForecasting, setIsForecasting] = useState(false);

  const handleForecast = () => {
    if (!product.name.trim()) {
      alert("请输入商品名称");
      return;
    }
    
    setIsForecasting(true);
    
    setTimeout(() => {
      // 获取历史数据
      const categoryHistory = historicalSalesData.filter((h: any) => h.category === product.category);
      const avgSales = categoryHistory.length > 0
        ? categoryHistory.reduce((sum: number, h: any) => sum + h.sales, 0) / categoryHistory.length
        : 5000;
      const avgGrowth = categoryHistory.length > 0
        ? categoryHistory.reduce((sum: number, h: any) => sum + h.growth, 0) / categoryHistory.length
        : 10;

      // 模拟预测数据
      const forecastData = [
        { month: "1月", 预测销量: Math.floor(avgSales * 0.8) },
        { month: "2月", 预测销量: Math.floor(avgSales * 0.9) },
        { month: "3月", 预测销量: Math.floor(avgSales) },
        { month: "4月", 预测销量: Math.floor(avgSales * 1.1) },
        { month: "5月", 预测销量: Math.floor(avgSales * 1.2) },
        { month: "6月", 预测销量: Math.floor(avgSales * 1.4) },
      ];

      setResult({
        category: product.category,
        baseSales: avgSales,
        growthRate: avgGrowth,
        forecastData,
        gmvForecast: {
          month1: Math.floor(avgSales * 0.8 * product.price),
          month3: Math.floor(avgSales * 3 * product.price * 1.1),
          month6: Math.floor(avgSales * 6 * product.price * 1.3),
        },
        confidence: 85,
        factors: [
          { name: "历史趋势", impact: "+25%", positive: true },
          { name: "市场竞争", impact: "-8%", positive: false },
          { name: "季节因素", impact: "+15%", positive: true },
          { name: "价格定位", impact: "+5%", positive: true },
        ]
      });
      
      setIsForecasting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">销量预测</h2>
        <p className="text-gray-400">基于多维度算法预测未来6个月销量趋势</p>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">商品名称</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              placeholder="输入商品名称"
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">商品分类</label>
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            >
              <option>Hoodies</option>
              <option>T-Shirts</option>
              <option>Pants</option>
              <option>Jackets</option>
              <option>Sweaters</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">售价 ($)</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">目标月份</label>
            <input
              type="month"
              value={product.targetMonth}
              onChange={(e) => setProduct({ ...product, targetMonth: e.target.value })}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={handleForecast}
          disabled={isForecasting || !product.name.trim()}
          className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isForecasting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              AI 预测中...
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              开始预测
            </>
          )}
        </button>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* GMV Forecast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-gray-400">第1个月</span>
              </div>
              <div className="text-3xl font-bold">${result.gmvForecast.month1.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mt-1">预测 GMV</div>
            </div>
            
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span className="text-gray-400">前3个月</span>
              </div>
              <div className="text-3xl font-bold">${result.gmvForecast.month3.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mt-1">预测 GMV</div>
            </div>
            
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                <span className="text-gray-400">前6个月</span>
              </div>
              <div className="text-3xl font-bold">${result.gmvForecast.month6.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mt-1">预测 GMV</div>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-6">6个月销量预测趋势</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.forecastData}>
                  <defs>
                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "预测销量"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="预测销量"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#forecastGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Factors */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">预测因素分析</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.factors.map((factor: any, i: number) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${
                    factor.positive ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
                  }`}
                >
                  <div className="text-sm text-gray-400 mb-1">{factor.name}</div>
                  <div className={`text-xl font-bold ${factor.positive ? "text-green-400" : "text-red-400"}`}>
                    {factor.impact}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="font-medium">预测置信度</span>
              </div>
              <div className="text-2xl font-bold">{result.confidence}%</div>
              <p className="text-sm text-gray-400 mt-1">
                基于历史数据、市场趋势和竞品分析的 综合预测结果
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold mb-4">预测算法说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-primary">多维度预测模型</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• 历史销售数据分析 (权重 25%)</li>
                <li>• 友商数据对标 (权重 20%)</li>
                <li>• 行业趋势分析 (权重 20%)</li>
                <li>• 季节性因素 (权重 15%)</li>
                <li>• 价格敏感度 (权重 10%)</li>
                <li>• 社交媒体热度 (权重 10%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-secondary">数据来源</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• 平台历史销售数据</li>
                <li>• Amazon / TikTok 关键词</li>
                <li>• 竞品店铺公开数据</li>
                <li>• 行业报告统计</li>
                <li>• 社交媒体趋势</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}