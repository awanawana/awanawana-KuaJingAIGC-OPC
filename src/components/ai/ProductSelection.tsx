"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, ArrowRight, Copy, Check } from "lucide-react";
import { aiProductSuggestions, platformKeywords } from "@/lib/data";

type TabType = "product-selection" | "erp-sourcing" | "competitor-stores" | "competitor-analysis" | "product-listing" | "keywords" | "sales-forecast";

interface Props {
  onNavigate: (tab: TabType, params?: Record<string, string>) => void;
}

export default function ProductSelection({ onNavigate }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [targetMarket, setTargetMarket] = useState("全球");
  const [priceRange, setPriceRange] = useState("全部");
  const [analysisResults, setAnalysisResults] = useState<any[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!searchKeyword.trim()) return;
    
    setIsAnalyzing(true);
    
    // 模拟 AI 分析
    setTimeout(() => {
      const mockResults = aiProductSuggestions.map((product, i) => ({
        ...product,
        marketScore: Math.floor(Math.random() * 30) + 70,
        competitionScore: Math.floor(Math.random() * 40) + 30,
        profitMargin: Math.floor(Math.random() * 20) + 25,
      }));
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
        <p className="text-gray-400">输入类目关键词，AI 将分析市场需求、竞争强度和利润空间</p>
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

      {/* Results */}
      {analysisResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold">推荐商品</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResults.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold mb-1">{product.name}</h4>
                    <p className="text-sm text-gray-400">{product.category}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    潜力商品
                  </span>
                </div>
                
                {/* Scores */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{product.marketScore}</div>
                    <div className="text-xs text-gray-400">市场需求</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{product.competitionScore}</div>
                    <div className="text-xs text-gray-400">竞争强度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{product.profitMargin}%</div>
                    <div className="text-xs text-gray-400">利润率</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">{product.reason}</p>
                
                <button
                  onClick={() => onNavigate("product-listing", { 
                    product: product.name, 
                    reason: product.reason,
                    category: product.category
                  })}
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  生成 Listing
                  <ArrowRight className="w-4 h-4" />
                </button>
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
              {platformKeywords.amazon.slice(0, 5).map((k: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{k.keyword}</span>
                  <span className="text-primary">{k.volume.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3 text-secondary">TikTok 趋势</h4>
            <div className="space-y-2">
              {platformKeywords.tiktok.slice(0, 5).map((k: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{k.keyword}</span>
                  <span className="text-secondary">#{k.hashtag}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3 text-accent">Reddit 讨论</h4>
            <div className="space-y-2">
              {platformKeywords.reddit.slice(0, 5).map((k: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{k.keyword}</span>
                  <span className="text-accent">{k.posts} 帖</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}