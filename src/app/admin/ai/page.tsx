"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Package, TrendingUp, BarChart3, Search, Settings, FileText } from "lucide-react";
import { ProductSelection, ProductListing, SalesForecast } from "@/components/ai";

type TabType = "product-selection" | "erp-sourcing" | "competitor-stores" | "competitor-analysis" | "product-listing" | "keywords" | "sales-forecast";

const tabs = [
  { id: "product-selection", label: "AI 选品", icon: Sparkles },
  { id: "product-listing", label: "AI 上品", icon: FileText },
  { id: "sales-forecast", label: "销量预测", icon: TrendingUp },
  { id: "keywords", label: "关键词分析", icon: Search },
  { id: "erp-sourcing", label: "ERP 货盘", icon: Package },
  { id: "competitor-stores", label: "竞品店铺", icon: BarChart3 },
  { id: "competitor-analysis", label: "竞品分析", icon: BarChart3 },
];

function AIToolsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const productParam = searchParams.get('product');
  const reasonParam = searchParams.get('reason');
  const categoryParam = searchParams.get('category');

  const [activeTab, setActiveTab] = useState<TabType>((tabParam as TabType) || "product-selection");

  const handleNavigate = (tab: TabType, params?: Record<string, string>) => {
    setActiveTab(tab);
    // TODO: Update URL with params
    if (params) {
      console.log("Navigate with params:", tab, params);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "product-selection":
        return <ProductSelection onNavigate={handleNavigate} />;
      
      case "product-listing":
        return (
          <ProductListing 
            initialProduct={productParam || ""}
            initialCategory={categoryParam || "Hoodies"}
            initialFeatures={reasonParam || ""}
          />
        );
      
      case "sales-forecast":
        return <SalesForecast />;
      
      case "keywords":
        return <KeywordsAnalysis />;
      
      case "erp-sourcing":
        return <ERPSourcing />;
      
      case "competitor-stores":
        return <CompetitorStores />;
      
      case "competitor-analysis":
        return <CompetitorAnalysis />;
      
      default:
        return <ProductSelection onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI 智能工具</h1>
              <p className="text-gray-400 text-sm">助力跨境卖家高效运营</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Suspense fallback={<div className="text-center py-20">加载中...</div>}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
}

// Placeholder components for remaining tabs
function KeywordsAnalysis() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">关键词分析</h2>
        <p className="text-gray-400">聚合 Amazon、TikTok、Reddit 平台关键词热度与竞价</p>
      </motion.div>
      <div className="bg-card rounded-2xl p-12 border border-border text-center">
        <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold mb-2">即将上线</h3>
        <p className="text-gray-400">关键词分析功能正在开发中...</p>
      </div>
    </div>
  );
}

function ERPSourcing() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">ERP 货盘</h2>
        <p className="text-gray-400">热门商品数据聚合，发现高潜力货源</p>
      </motion.div>
      <div className="bg-card rounded-2xl p-12 border border-border text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold mb-2">即将上线</h3>
        <p className="text-gray-400">ERP 货盘功能正在开发中...</p>
      </div>
    </div>
  );
}

function CompetitorStores() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">竞品店铺</h2>
        <p className="text-gray-400">监控竞品店铺数据，了解市场动态</p>
      </motion.div>
      <div className="bg-card rounded-2xl p-12 border border-border text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold mb-2">即将上线</h3>
        <p className="text-gray-400">竞品店铺监控功能正在开发中...</p>
      </div>
    </div>
  );
}

function CompetitorAnalysis() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">竞品分析</h2>
        <p className="text-gray-400">深度分析竞品数据，制定竞争策略</p>
      </motion.div>
      <div className="bg-card rounded-2xl p-12 border border-border text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold mb-2">即将上线</h3>
        <p className="text-gray-400">竞品分析功能正在开发中...</p>
      </div>
    </div>
  );
}

export default function AIPage() {
  return <AIToolsContent />;
}