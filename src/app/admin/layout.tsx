"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LayoutDashboard, ShoppingBag, Sparkles, Settings, LogOut, ChevronRight, Users, Sliders, ChevronDown, Package, Search, Database, BarChart3, Store, TrendingUp, Loader2, User } from "lucide-react";

const navItems = [
  { href: "/admin", label: "数据概览", icon: LayoutDashboard },
  { href: "/admin/visitors", label: "访客画像", icon: Users },
  { href: "/admin/products", label: "商品管理", icon: ShoppingBag },
];

// AI工具二级导航
const aiToolItems = [
  { href: "/admin/ai?tab=product-selection", label: "AI选品", icon: Package },
  { href: "/admin/ai?tab=product-listing", label: "AI上品", icon: Sparkles },
  { href: "/admin/ai?tab=keywords", label: "关键词分析", icon: Search },
  { href: "/admin/ai?tab=sales-forecast", label: "销量预测", icon: TrendingUp },
];

// 数据洞察二级导航
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
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [aiToolsExpanded, setAiToolsExpanded] = useState(true);
  const [dataInsightsExpanded, setDataInsightsExpanded] = useState(true);

  // 检查是否是登录页面
  const isLoginPage = pathname === "/admin/login";

  // 检查是否是AI工具相关页面
  const isAiToolsPage = pathname.startsWith('/admin/ai');

  // 检查登录状态
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, loading, router, isLoginPage]);

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 登录页面不显示侧边栏
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 未登录不显示内容
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
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

          {/* AI工具展开区域 */}
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
                  const itemPath = item.href.split('?')[0];
                  const isCurrentItem = pathname === itemPath ||
                    (pathname === '/admin/ai' && item.href.includes('product-selection'));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ml-2 text-sm ${
                          isCurrentItem
                            ? "text-white font-medium"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
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

          {/* 数据洞察展开区域 */}
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
                  const itemPath = item.href.split('?')[0];
                  const isActive = pathname === itemPath;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ml-2 text-sm ${
                          isActive
                            ? "text-white font-medium"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === '/admin/ai-config'
                ? "bg-primary text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span>选品配置</span>
          </Link>
          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === '/admin/users'
                ? "bg-primary text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>账号管理</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}