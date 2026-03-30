"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Image, Copy, Check, Sparkles, Zap } from "lucide-react";
import { platformKeywords } from "@/lib/data";

interface Props {
  initialProduct?: string;
  initialCategory?: string;
  initialFeatures?: string;
}

export default function ProductListing({ 
  initialProduct = "", 
  initialCategory = "Hoodies",
  initialFeatures = "" 
}: Props) {
  const [form, setForm] = useState({
    productName: initialProduct,
    category: initialCategory,
    features: initialFeatures,
    keywords: ""
  });
  
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<(string | null)[]>([null, null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialProduct) {
      const autoKeywords = getKeywordsByCategory(initialCategory);
      setForm(prev => ({ ...prev, keywords: autoKeywords }));
    }
  }, [initialProduct, initialCategory]);

  const getKeywordsByCategory = (category: string): string => {
    const cat = category.toLowerCase();
    let keywords: string[] = [];

    if (cat.includes("hoodie") || cat.includes("卫衣")) {
      keywords = platformKeywords.amazon.filter((k: any) => k.keyword.includes("hoodie")).map((k: any) => k.keyword);
    } else if (cat.includes("jacket") || cat.includes("外套")) {
      keywords = platformKeywords.amazon.filter((k: any) => k.keyword.includes("jacket")).map((k: any) => k.keyword);
    } else if (cat.includes("pants") || cat.includes("裤")) {
      keywords = platformKeywords.amazon.filter((k: any) => k.keyword.includes("pants")).map((k: any) => k.keyword);
    }

    if (keywords.length === 0) {
      keywords = platformKeywords.amazon.slice(0, 5).map((k: any) => k.keyword);
    }

    const tiktokTags = platformKeywords.tiktok.slice(0, 2).map((t: any) => t.keyword);
    return [...keywords, ...tiktokTags].join(", ");
  };

  const generateListing = () => {
    if (!form.productName.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      // 生成标题
      const titles = [
        `${form.productName} - 男女同款潮流百搭`,
        `【热销】${form.productName} 时尚舒适`,
        `${form.category}系列 ${form.productName} 经典款`,
      ];
      setGeneratedTitle(titles[Math.floor(Math.random() * titles.length)]);
      
      // 生成分类描述
      const cat = form.category.toLowerCase();
      let material = "优质面料";
      let feature1 = "舒适透气";
      let feature2 = "百搭款式";
      
      if (cat.includes("hoodie") || cat.includes("卫衣")) {
        material = "加绒加厚优质棉料";
        feature1 = "保暖又时尚";
        feature2 = "宽松落肩设计";
      } else if (cat.includes("jacket") || cat.includes("外套")) {
        material = "防风防水面料";
        feature1 = "保暖锁温";
        feature2 = "立体剪裁";
      } else if (cat.includes("pants") || cat.includes("裤")) {
        material = "高弹力面料";
        feature1 = "修身显瘦";
        feature2 = "多口袋设计";
      }
      
      // 生成描述
      const descriptions = [
        `这款${form.productName}采用${material}，${feature1}，${feature2}。${form.features || "无论是日常出街还是运动休闲，都能轻松驾驭。"}简约而不简单，时尚且实用。`,
        `【品质保证】${form.productName}，精选${material}，${feature1}。${feature2}，适合各种场合穿着。经典百搭，永不过时。`,
      ];
      setGeneratedDescription(descriptions[Math.floor(Math.random() * descriptions.length)]);
      
      // 生成卖点
      const bulletTemplates: Record<string, string[]> = {
        default: [
          "✓ 优质面料，舒适透气",
          "✓ 时尚设计，潮流百搭",
          "✓ 精细做工，品质保证",
          "✓ 多色可选，满足不同需求",
          "✓ 售后无忧，购物更放心"
        ],
        hoodies: [
          "✓ 加绒加厚面料，保暖舒适",
          "✓ 宽松落肩设计，修饰身型",
          "✓ 简约LOGO印花，低调潮流",
          "✓ 男女同款，多色可选"
        ],
        jackets: [
          "✓ 防风防水面料，户外防护",
          "✓ 轻量化设计，上身无负担",
          "✓ 立体剪裁，版型挺括",
          "✓ 内里加绒，保暖升级"
        ],
        pants: [
          "✓ 高弹力面料，运动自如",
          "✓ 多口袋工装设计，实用潮流",
          "✓ 修身剪裁，视觉显瘦",
          "✓ 经典百搭色系"
        ]
      };
      
      let key = "default";
      if (cat.includes("hoodie")) key = "hoodies";
      else if (cat.includes("jacket")) key = "jackets";
      else if (cat.includes("pants")) key = "pants";
      
      setBulletPoints(bulletTemplates[key] || bulletTemplates.default);
      
      // 模拟生成图片
      setGeneratedImages([
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
        null,
        null,
        null
      ]);
      
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied({ ...copied, [key]: false }), 2000);
  };

  const handleGenerateImages = () => {
    setGeneratedImages([null, null, null, null, null]);
    // 调用 API 生成图片
    // TODO: 集成火山引擎 API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">AI 上品</h2>
        <p className="text-gray-400">自动生成商品标题、描述、卖点文案和商品图片</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">商品名称</label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              placeholder="例如: Urban Street Hoodie"
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">商品分类</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            >
              <option>Hoodies</option>
              <option>T-Shirts</option>
              <option>Pants</option>
              <option>Jackets</option>
              <option>Sweaters</option>
              <option>Tops</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">商品特点</label>
            <textarea
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="描述商品的独特卖点..."
              rows={3}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none resize-none"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">关键词（可选）</label>
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="SEO 关键词，逗号分隔"
              className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={generateListing}
          disabled={isGenerating || !form.productName.trim()}
          className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              AI 正在生成中...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              生成 Listing
            </>
          )}
        </button>
      </motion.div>

      {/* Generated Content */}
      {(generatedTitle || generatedDescription) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Title */}
          {generatedTitle && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  商品标题
                </h3>
                <button
                  onClick={() => handleCopy("title", generatedTitle)}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {copied.title ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-lg">{generatedTitle}</p>
            </div>
          )}
          
          {/* Description */}
          {generatedDescription && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  商品描述
                </h3>
                <button
                  onClick={() => handleCopy("description", generatedDescription)}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {copied.description ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-300 leading-relaxed">{generatedDescription}</p>
            </div>
          )}
          
          {/* Bullet Points */}
          {bulletPoints.length > 0 && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  亚马逊卖点
                </h3>
                <button
                  onClick={() => handleCopy("bullets", bulletPoints.join("\n"))}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {copied.bullets ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <ul className="space-y-2">
                {bulletPoints.map((point, i) => (
                  <li key={i} className="text-gray-300">{point}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Image Generation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            AI 商品图片
          </h3>
          <button
            onClick={handleGenerateImages}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            重新生成
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {generatedImages.map((img, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl overflow-hidden bg-background border border-border"
            >
              {img ? (
                <img src={img} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Image className="w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-400 mt-4">
          * 图片生成需要配置火山引擎 Seedance API Key
        </p>
      </motion.div>
    </div>
  );
}