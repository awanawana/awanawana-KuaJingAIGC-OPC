"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以将错误上报到监控系统
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">出现了一些问题</h2>
        <p className="text-gray-400 mb-8">
          很抱歉，页面加载时发生了错误。请尝试刷新或返回首页。
        </p>
        
        {error.digest && (
          <p className="text-sm text-gray-500 mb-6 font-mono">
            错误代码: {error.digest}
          </p>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover rounded-xl font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            重试
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 border border-border hover:border-primary rounded-xl font-medium transition-all"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </motion.div>
    </div>
  );
}