"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Truck, Shield, RotateCcw, ChevronLeft, Check } from "lucide-react";
import { products, productReviews, Review } from "@/lib/data";

export default function ProductPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);
  const reviews = product ? productReviews[product.id] || [] : [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">商品未找到</h1>
          <Link href="/" className="text-primary hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>返回</span>
          </Link>
          <Link href="/" className="text-2xl font-bold gradient-text">
            NEXUS
          </Link>
          <button className="glass px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden mb-4">
              <Image
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image 
                    src={img} 
                    alt="" 
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  畅销商品
                </span>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  已售 {product.sales.toLocaleString()} 件
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">
                  {product.rating} ({product.reviews.toLocaleString()} 条评价)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">¥{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    ¥{product.originalPrice}
                  </span>
                  <span className="px-3 py-1 bg-secondary text-white rounded-full text-sm">
                    省{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed">{product.description}</p>

            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-3">颜色</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedColor === color
                        ? "border-primary bg-primary/20"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-semibold mb-3">尺码</h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border transition-all flex items-center justify-center font-medium ${
                      selectedSize === size
                        ? "border-primary bg-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-primary hover:bg-primary-hover py-4 rounded-full font-semibold transition-all glow-hover">
                立即购买
              </button>
              <button className="px-6 py-4 rounded-full border border-border hover:border-primary transition-all">
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-400">免运费</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-400">安全支付</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-gray-400">30天退换</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8">
            用户评价 <span className="text-gray-400">({reviews.length})</span>
          </h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </motion.section>

        {/* More Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">您可能也喜欢</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="bg-card rounded-2xl overflow-hidden card-hover">
                    <div className="aspect-square image-zoom">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{p.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">¥{p.price}</span>
                        <span className="text-sm text-gray-400">已售 {p.sales.toLocaleString()} 件</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={review.avatar}
            alt={review.userName}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{review.userName}</span>
              {review.verified && (
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                  <Check className="w-3 h-3" /> 已验证
                </span>
              )}
            </div>
            <span className="text-gray-500 text-sm">{review.date}</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-300">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}