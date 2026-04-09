"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, ShoppingBag, TrendingUp, Sparkles, Globe, Calculator, Zap, Copy, Check, Loader2 } from "lucide-react";
import { products, categories, Product } from "@/lib/data";

// 支持的语言选项
const LANGUAGES = [
  { code: "en", name: "英语" },
  { code: "ja", name: "日语" },
  { code: "ko", name: "韩语" },
  { code: "es", name: "西班牙语" },
  { code: "fr", name: "法语" },
  { code: "de", name: "德语" },
  { code: "it", name: "意大利语" },
];

// 定价策略选项
const PRICING_STRATEGIES = [
  { id: "dynamic", name: "动态定价", desc: "综合成本、需求、竞品智能定价" },
  { id: "cost_plus", name: "成本加成", desc: "基于成本和目标利润率" },
  { id: "competitive", name: "竞争导向", desc: "参考竞品价格" },
  { id: "premium", name: "高端定价", desc: "追求品牌溢价" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const videoRef = useRef<HTMLVideoElement>(null);

  // 翻译功能状态
  const [translateText, setTranslateText] = useState("");
  const [translateLang, setTranslateLang] = useState("en");
  const [translateResult, setTranslateResult] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateCopied, setTranslateCopied] = useState(false);

  // 定价功能状态
  const [pricingData, setPricingData] = useState({
    productName: "",
    cost: 50,
    shippingCost: 10,
    platformFee: 15,
    competitorPrices: "",
    strategy: "dynamic",
    demandLevel: "medium",
  });
  const [pricingResult, setPricingResult] = useState<any>(null);
  const [isPricing, setIsPricing] = useState(false);

  const filteredProducts = selectedCategory === "全部"
    ? products
    : products.filter(p => p.category === selectedCategory);

  // 翻译功能
  const handleTranslate = async () => {
    if (!translateText.trim()) return;

    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: translateText,
          targetLang: translateLang,
        }),
      });
      const data = await res.json();
      setTranslateResult(data.translation || translateText);
    } catch (error) {
      console.error("翻译失败:", error);
      setTranslateResult(translateText);
    }
    setIsTranslating(false);
  };

  // 定价功能
  const handlePricing = async () => {
    if (!pricingData.productName.trim()) return;

    setIsPricing(true);
    try {
      const competitorPricesArray = pricingData.competitorPrices
        ? pricingData.competitorPrices.split(",").map(p => parseFloat(p.trim())).filter(p => !isNaN(p))
        : [];

      const res = await fetch("/api/ai-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: pricingData.productName,
          cost: pricingData.cost,
          shippingCost: pricingData.shippingCost,
          platformFee: pricingData.platformFee,
          competitorPrices: competitorPricesArray.length > 0 ? competitorPricesArray : undefined,
          strategy: pricingData.strategy,
          demandLevel: pricingData.demandLevel,
        }),
      });
      const data = await res.json();
      setPricingResult(data.pricing);
    } catch (error) {
      console.error("定价失败:", error);
    }
    setIsPricing(false);
  };

  const copyTranslation = () => {
    navigator.clipboard.writeText(translateResult);
    setTranslateCopied(true);
    setTimeout(() => setTranslateCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold gradient-text">
            NEXUS
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-primary transition-colors">首页</Link>
          </div>
          <button className="glass px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Hero Video Section */}
      <section className="relative h-screen overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/docs/images/all.mov" type="video/quicktime" />
        </video>
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-4"
              >
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="text-secondary uppercase tracking-wider text-sm font-medium">
                  跨境电商智能体
                </span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                NEXUS
                <span className="gradient-text block text-3xl md:text-5xl mt-2">智能选品 & AI 上品</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                输入类目关键词，AI 智能分析市场需求、竞争强度和利润空间，输出潜力商品推荐
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover px-8 py-4 rounded-full font-semibold transition-all glow-hover"
              >
                进入后台管理
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              AI <span className="gradient-text">智能工具</span>
            </h2>
            <p className="text-gray-400">强大的 AI 能力，助力跨境电商运营</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 翻译功能 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">AI 智能翻译</h3>
                  <p className="text-gray-400 text-sm">支持 10+ 语言翻译</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">输入文本</label>
                  <textarea
                    value={translateText}
                    onChange={(e) => setTranslateText(e.target.value)}
                    placeholder="输入需要翻译的中文文本..."
                    className="w-full bg-card border border-border rounded-xl p-3 h-24 focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-2">目标语言</label>
                    <select
                      value={translateLang}
                      onChange={(e) => setTranslateLang(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary focus:outline-none"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleTranslate}
                      disabled={isTranslating || !translateText.trim()}
                      className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-xl font-medium transition-all flex items-center gap-2"
                    >
                      {isTranslating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                      翻译
                    </button>
                  </div>
                </div>

                {translateResult && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">翻译结果</label>
                    <div className="relative">
                      <textarea
                        value={translateResult}
                        readOnly
                        className="w-full bg-card border border-primary/30 rounded-xl p-3 h-24 focus:outline-none resize-none"
                      />
                      <button
                        onClick={copyTranslation}
                        className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {translateCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 定价功能 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-background rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">AI 动态定价</h3>
                  <p className="text-gray-400 text-sm">智能分析最优价格</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">商品名称</label>
                  <input
                    type="text"
                    value={pricingData.productName}
                    onChange={(e) => setPricingData({ ...pricingData, productName: e.target.value })}
                    placeholder="例如: 潮流卫衣"
                    className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">成本(元)</label>
                    <input
                      type="number"
                      value={pricingData.cost}
                      onChange={(e) => setPricingData({ ...pricingData, cost: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">运费(元)</label>
                    <input
                      type="number"
                      value={pricingData.shippingCost}
                      onChange={(e) => setPricingData({ ...pricingData, shippingCost: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">平台佣金(%)</label>
                    <input
                      type="number"
                      value={pricingData.platformFee}
                      onChange={(e) => setPricingData({ ...pricingData, platformFee: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">定价策略</label>
                    <select
                      value={pricingData.strategy}
                      onChange={(e) => setPricingData({ ...pricingData, strategy: e.target.value })}
                      className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary focus:outline-none"
                    >
                      {PRICING_STRATEGIES.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">需求等级</label>
                    <select
                      value={pricingData.demandLevel}
                      onChange={(e) => setPricingData({ ...pricingData, demandLevel: e.target.value })}
                      className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary focus:outline-none"
                    >
                      <option value="low">低需求</option>
                      <option value="medium">中等需求</option>
                      <option value="high">高需求</option>
                      <option value="very_high">爆款</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">竞品价格 (逗号分隔，可选)</label>
                  <input
                    type="text"
                    value={pricingData.competitorPrices}
                    onChange={(e) => setPricingData({ ...pricingData, competitorPrices: e.target.value })}
                    placeholder="例如: 168, 199, 228"
                    className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  onClick={handlePricing}
                  disabled={isPricing || !pricingData.productName.trim()}
                  className="w-full py-3 bg-secondary hover:bg-secondary/80 disabled:opacity-50 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  {isPricing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                  计算最优价格
                </button>

                {pricingResult && (
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <div className="text-center mb-4">
                      <p className="text-gray-400 text-sm">推荐售价</p>
                      <p className="text-3xl font-bold gradient-text">¥{pricingResult.recommendedPrice}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="text-gray-500">成本</p>
                        <p className="font-medium">¥{pricingResult.analysis?.totalCost}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">预计利润</p>
                        <p className="font-medium text-green-400">¥{pricingResult.analysis?.estimatedProfit}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">利润率</p>
                        <p className="font-medium">{pricingResult.analysis?.profitMargin}%</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-gray-500 mb-2">多货币参考:</p>
                      <div className="flex gap-4 text-sm">
                        <span>💵 ${pricingResult.multiCurrency?.USD}</span>
                        <span>💶 €{pricingResult.multiCurrency?.EUR}</span>
                        <span>💷 £{pricingResult.multiCurrency?.GBP}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="glass border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "商品销量", value: "250K+" },
            { label: "好评客户", value: "45K+" },
            { label: "销售国家", value: "120+" },
            { label: "用户评价", value: "15K+" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-primary glow"
                    : "glass hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-16 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              热门<span className="gradient-text">商品</span>
            </h2>
            <p className="text-gray-400">发现我们最受欢迎的款式</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-4">NEXUS</h3>
              <p className="text-gray-400">为现代年轻人打造的潮流服饰品牌</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">购物</h4>
              <div className="space-y-2 text-gray-400">
                <p>全部商品</p>
                <p>新品上架</p>
                <p>热销榜单</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">公司</h4>
              <div className="space-y-2 text-gray-400">
                <p>关于我们</p>
                <p>联系我们</p>
                <p>加入我们</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">扫码关注</h4>
              <div className="flex gap-6">
                <div className="group relative">
                  <div className="w-28 h-28 bg-white rounded-xl overflow-hidden cursor-pointer transition-transform group-hover:scale-105 shadow-lg">
                    <img src="/wechat-qr.jpg" alt="微信" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-sm text-gray-400 mt-2 block text-center">微信客服</span>
                  <div className="absolute hidden group-hover:block -top-2 -left-2 w-64 h-64 bg-white rounded-2xl p-2 shadow-2xl z-50 border-2 border-primary">
                    <img src="/wechat-qr.jpg" alt="微信" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="group relative">
                  <div className="w-28 h-28 bg-white rounded-xl overflow-hidden cursor-pointer transition-transform group-hover:scale-105 shadow-lg">
                    <img src="/xiaohongshu-qr.jpg" alt="小红书" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-sm text-gray-400 mt-2 block text-center">小红书</span>
                  <div className="absolute hidden group-hover:block -top-2 -left-2 w-64 h-64 bg-white rounded-2xl p-2 shadow-2xl z-50 border-2 border-primary">
                    <img src="/xiaohongshu-qr.jpg" alt="小红书" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-gray-400 text-sm">📞 联系电话: 王先生 +86 13110501167</p>
                <p className="text-gray-400 text-sm mt-1">📍 工厂地址: 中国福建省晋江市新塘街道开发区北一区37-38号</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2026 NEXUS. 保留所有权利</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/product/${product.id}`}>
        <div className="group bg-card rounded-2xl overflow-hidden card-hover">
          <div className="aspect-[3/4] relative image-zoom">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.originalPrice && (
              <div className="absolute top-4 left-4 bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                特惠
              </div>
            )}
            <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-sm">#{index + 1}</span>
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-primary px-6 py-3 rounded-full font-semibold">
                查看详情
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">{product.category}</span>
              <span className="text-xs text-green-400 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" />
                已售 {product.sales.toLocaleString()} 件
              </span>
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">¥{product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through">
                  ¥{product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-400 ml-1">
                ({product.reviews.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}