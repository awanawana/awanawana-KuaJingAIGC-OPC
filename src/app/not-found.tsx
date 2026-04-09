"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-8xl font-bold gradient-text mb-4"
        >
          404
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">页面未找到</h2>
        <p className="text-gray-400 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover rounded-xl font-medium transition-all"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border border-border hover:border-primary rounded-xl font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上页
          </button>
        </div>
      </motion.div>
    </div>
  );
}