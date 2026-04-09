"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, ArrowRight, Copy, Check, RefreshCw, ExternalLink, Package, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { aiProductSuggestions, platformKeywords, erpProductData } from "@/lib/data";
import type { AITabType, AnalysisResult, KeywordData } from "@/types";
import Link from "next/link";

interface ProductSelectionProps {
  onNavigate: (tab: AITabType, params?: Record<string, string>) => void;
}

// 增强的选品数据结构
interface EnhancedProduct extends AnalysisResult {
  demand: number;
  competition: number;
  profit: number;
  search: number;
  trend: number;
  score: number;
  risk: string;
  gmv: string;
  roas: string;
  acos: string;
  margin: string;
  bsr: string;
  competitionCount: number;
  reviews: number;
  trendData: string;
  action: string;
  linksByPlatform: Record<string, { name: string; url: string }[]>;
}

export default function ProductSelection({ onNavigate }: ProductSelectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [targetMarket, setTargetMarket] = useState<string>("全球");
  const [priceRange, setPriceRange] = useState<string>("全部");
  const [analysisResults, setAnalysisResults] = useState<EnhancedProduct[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!searchKeyword.trim()) return;

    setIsAnalyzing(true);

    // 生成增强的分析结果
    setTimeout(() => {
      const mockResults: EnhancedProduct[] = aiProductSuggestions.map((product, i) => {
        const demand = Math.floor(Math.random() * 25) + 75;
        const competition = Math.floor(Math.random() * 40) + 30;
        const profit = Math.floor(Math.random() * 30) + 65;
        const search = Math.floor(Math.random() * 30) + 70;
        const trend = Math.floor(Math.random() * 35) + 65;
        const score = Math.floor((demand + (100 - competition) + profit + search + trend) / 5);

        return {
          id: `product-${i}`,
          name: product.name,
          category: product.category || "服装",
          source: product.source || "AI推荐",
          reason: `${product.name} 在${targetMarket}市场需求${product.demand}，竞争${product.competition}，趋势${product.trend}，综合评分 ${score}分`,
          demand,
          competition,
          profit,
          search,
          trend,
          score,
          risk: score > 85 ? "低" : "中",
          gmv: `$${(Math.random() * 50 + 20).toFixed(1)}K`,
          roas: (Math.random() * 2 + 2).toFixed(1),
          acos: `${(Math.random() * 20 + 15).toFixed(0)}%`,
          margin: `${(Math.random() * 15 + 20).toFixed(0)}%`,
          bsr: `#${Math.floor(Math.random() * 50000 + 1000)}`,
          competitionCount: Math.floor(Math.random() * 200 + 50),
          reviews: Math.floor(Math.random() * 5000 + 500),
          trendData: product.trend === "上升" ? "↑ 上升中" : product.trend === "增长" ? "↗ 增长中" : "→ 稳定",
          action: "生成 Listing",
          linksByPlatform: {
            "Amazon": [
              { name: `${product.name} - 爆款A`, url: "https://www.amazon.com/dp/B08N5WRWNW" },
              { name: `${product.name} - 爆款B`, url: "https://www.amazon.com/dp/B09JQM3XYV" },
              { name: `${product.name} - 爆款C`, url: "https://www.amazon.com/dp/B07YTF9SZ6" },
            ],
            "TikTok": [
              { name: `${product.name} - 热门视频`, url: "https://www.tiktok.com/@fashionnova/video/123456" },
              { name: `${product.name} - 网红推荐`, url: "https://www.tiktok.com/@revolve/video/234567" },
            ],
            "Shopify": [
              { name: `${product.name} - 独立站爆款`, url: "https://storeexample.com/products/123" },
            ],
          },
        };
      });

      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">AI 智能选品</h2>
        <p className="text-gray-400">输入类目关键词，AI 将分析市场需求、竞争强度和利润空间，输出潜力商品推荐及 GMV 预测</p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">类目关键词</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="例如: Hoodies, Jackets, Cargo Pants"
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">目标市场</label>
            <select
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            >
              <option>全球</option>
              <option>北美</option>
              <option>欧洲</option>
              <option>日本</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">价格区间</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            >
              <option>全部</option>
              <option>$20-$50</option>
              <option>$50-$100</option>
              <option>$100-$200</option>
              <option>$200+</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !searchKeyword.trim()}
          className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              AI 正在分析中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              开始 AI 分析
            </>
          )}
        </button>
      </motion.div>

      {/* Analysis Results */}
      {analysisResults && analysisResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">📊 AI分析报告 - "{searchKeyword}"</h3>
              <p className="text-sm text-gray-400 mt-1">目标市场: {targetMarket} | 价格区间: {priceRange}</p>
            </div>
            <button
              onClick={handleAnalyze}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              重新分析
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full">高需求</span>
            <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">低竞争</span>
            <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">高利润</span>
          </div>

          <div className="space-y-4">
            {analysisResults.map((product, i) => (
              <motion.div
                key={product.id}
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

                {/* 评分维度条 - 6个维度 */}
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

                {/* 店铺链接 */}
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-xs text-gray-500 mb-3">🔗 参考商品链接 (点击跳转)</p>
                  <div className="space-y-3">
                    {Object.entries(product.linksByPlatform).map(([platform, links]) => (
                      <div key={platform} className="bg-background/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{platform}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {links.map((link, linkIdx) => (
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
        </motion.div>
      )}

      {/* Platform Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">平台关键词热度</h3>
          <button
            onClick={() => handleCopy(JSON.stringify(platformKeywords, null, 2))}
            className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "已复制" : "复制数据"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-3 text-primary">Amazon 关键词</h4>
            <div className="space-y-2">
              {platformKeywords.amazon.slice(0, 5).map((k: KeywordData, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{k.keyword}</span>
                  <span className="text-primary">{k.volume?.toLocaleString() || k.searchVolume?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3 text-secondary">TikTok 趋势</h4>
            <div className="space-y-2">
              {platformKeywords.tiktok.slice(0, 5).map((k: KeywordData, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{k.keyword || k.name}</span>
                  <span className="text-secondary">#{k.views?.toLocaleString() || k.posts}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3 text-accent">Reddit 讨论</h4>
            <div className="space-y-2">
              {platformKeywords.reddit.slice(0, 5).map((k: KeywordData, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{k.keyword}</span>
                  <span className="text-accent">{k.posts} 帖</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ERP Sourcing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">📦 ERP 货盘数据</h3>
            <p className="text-sm text-gray-400 mt-1">热门商品数据聚合，发现高潜力货源</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">商品名称</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">价格</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">销量</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">数据源</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">增长</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">类目</th>
              </tr>
            </thead>
            <tbody>
              {erpProductData.slice(0, 5).map((product, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-background/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">${product.price}</td>
                  <td className="py-3 px-4">{product.sales.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">{product.source}</span>
                  </td>
                  <td className="py-3 px-4 text-green-400">{product.growth}</td>
                  <td className="py-3 px-4 text-gray-400">{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}