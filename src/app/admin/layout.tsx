import type { Metadata } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, ShoppingBag, Sparkles, Settings, LogOut, ChevronRight, Users, Sliders, ChevronDown, Package, Search, Database, BarChart3, Store, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "管理后台 | NEXUS 跨境电商",
  description: "NEXUS 电商管理后台，数据概览、AI智能选品、商品管理、访客分析",
};

const navItems = [
  { href: "/admin", label: "数据概览", icon: LayoutDashboard },
  { href: "/admin/visitors", label: "访客画像", icon: Users },
  { href: "/admin/products", label: "商品管理", icon: ShoppingBag },
];

const aiToolItems = [
  { href: "/admin/ai?tab=product-selection", label: "AI选品", icon: Package },
  { href: "/admin/ai?tab=product-listing", label: "AI上品", icon: Sparkles },
  { href: "/admin/ai?tab=keywords", label: "关键词分析", icon: Search },
  { href: "/admin/ai?tab=sales-forecast", label: "销量预测", icon: TrendingUp },
];

const dataInsightItems = [
  { href: "/admin/ai?tab=competitor-analysis", label: "竞品分析", icon: BarChart3 },
  { href: "/admin/ai?tab=erp-sourcing", label: "ERP货盘", icon: Store },
  { href: "/admin/ai?tab=competitor-stores", label: "竞品数据", icon: Database },
];

const bottomNavItems = [
  { href: "/admin/ai", label: "AI工具", icon: Sparkles },
  { href: "/admin/ai-config", label: "选品配置", icon: Sliders },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [aiToolsExpanded, setAiToolsExpanded] = useState(true);
  const [dataInsightsExpanded, setDataInsightsExpanded] = useState(true);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="text-2xl font-bold gradient-text">
            NEXUS
          </Link>
          <p className="text-sm text-gray-500 mt-1">电商管理后台</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setAiToolsExpanded(!aiToolsExpanded)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Sparkles className="w-5 h-5" />
              <span className="flex-1 text-left">AI工具</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${aiToolsExpanded ? 'rotate-180' : ''}`} />
            </button>

            {aiToolsExpanded && (
              <ul className="space-y-1 mt-1">
                {aiToolItems.map((item) => {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ml-2 text-sm text-gray-400 hover:text-white hover:bg-white/5"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-border">
            <button
              onClick={() => setDataInsightsExpanded(!dataInsightsExpanded)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-gray-400 hover:text-white hover:bg-white/5"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="flex-1 text-left">数据洞察</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dataInsightsExpanded ? 'rotate-180' : ''}`} />
            </button>

            {dataInsightsExpanded && (
              <ul className="space-y-1 mt-1">
                {dataInsightItems.map((item) => {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ml-2 text-sm text-gray-400 hover:text-white hover:bg-white/5"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/admin/ai-config"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Sliders className="w-5 h-5" />
            <span>选品配置</span>
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" />
            <span>设置</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>返回店铺</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}