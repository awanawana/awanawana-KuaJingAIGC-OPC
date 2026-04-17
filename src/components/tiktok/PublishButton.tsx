"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Loader2, CheckCircle, XCircle } from "lucide-react";

interface PublishButtonProps {
  productData: {
    name: string;
    price: number;
    category: string;
    description: string;
    images: string[];
    sizes: string[];
    colors: string[];
  };
  listingData: {
    title: string;
    description: string;
    features: string;
  };
}

export default function PublishButton({ productData, listingData }: PublishButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);

  const handlePublish = async () => {
    if (!productData.name) {
      setPublishResult({
        success: false,
        message: "请先填写商品信息",
      });
      return;
    }

    setIsPublishing(true);
    setPublishResult(null);

    try {
      const response = await fetch("/api/tiktok/product/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          product: productData,
          listing: listingData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPublishResult({
          success: true,
          message: `商品已成功发布到TikTok Shop! (ID: ${data.product_id})`,
        });
      } else {
        setPublishResult({
          success: false,
          message: data.error || "发布失败",
        });
      }
    } catch (error: any) {
      setPublishResult({
        success: false,
        message: error.message || "发布失败，请重试",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={handlePublish}
        disabled={isPublishing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-[#FE2C55] hover:bg-[#FE2C55]/80 disabled:bg-[#FE2C55]/50 px-6 py-3 rounded-lg font-semibold transition-all"
      >
        {isPublishing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Store className="w-5 h-5" />
        )}
        {isPublishing ? "发布中..." : "发布到 TikTok Shop"}
      </motion.button>

      {publishResult && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            publishResult.success
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {publishResult.success ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{publishResult.message}</span>
        </motion.div>
      )}
    </div>
  );
}
