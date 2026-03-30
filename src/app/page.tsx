"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, ShoppingBag, TrendingUp, Sparkles } from "lucide-react";
import { products, categories, Product } from "@/lib/data";

// Hero slide data
const heroSlides = [
  {
    title: "潮流服饰系列",
    subtitle: "为勇敢者设计的独特风格",
    cta: "立即选购",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920",
  },
  {
    title: "新品上架",
    subtitle: "独特的风格，展现你的个性",
    cta: "探索更多",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920",
  },
  {
    title: "卓越品质",
    subtitle: "舒适剪裁，时尚设计",
    cta: "发现精彩",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredProducts = selectedCategory === "全部"
    ? products
    : products.filter(p => p.category === selectedCategory);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSlide ? "bg-primary w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.2 }}
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
                    新品上市 2026
                  </span>
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover px-8 py-4 rounded-full font-semibold transition-all glow-hover"
                >
                  {heroSlides[currentSlide].cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </AnimatePresence>
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
                  {/* 悬停放大 */}
                  <div className="absolute hidden group-hover:block -top-2 -left-2 w-64 h-64 bg-white rounded-2xl p-2 shadow-2xl z-50 border-2 border-primary">
                    <img src="/wechat-qr.jpg" alt="微信" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="group relative">
                  <div className="w-28 h-28 bg-white rounded-xl overflow-hidden cursor-pointer transition-transform group-hover:scale-105 shadow-lg">
                    <img src="/xiaohongshu-qr.jpg" alt="小红书" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-sm text-gray-400 mt-2 block text-center">小红书</span>
                  {/* 悬停放大 */}
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