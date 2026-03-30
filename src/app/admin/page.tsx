"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Users, Target } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// 生成2026年的随机订单
const generateOrders = () => {
  const customers = ["Alex M.", "Jordan K.", "Chris L.", "Taylor R.", "Morgan S.", "Sam W.", "Riley T.", "Casey M.", "Quinn D.", "Avery P.", "Blake H.", "Drew J.", "Jamie L.", "Morgan R.", "Casey W."];
  const products = ["Urban Street Hoodie", "Oversized Tee Collection", "Cargo Tech Pants", "Vintage Denim Jacket", "Graphic Print Sweater", "Fleece Lined Hoodie", "High-Waist Cargo Pants", "Cropped Puffer Jacket", "Athletic Tank Top", "Bomber Jacket"];
  const statuses = ["已完成", "处理中", "待付款", "已发货"];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `#ORD-${2900 + i}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    product: products[Math.floor(Math.random() * products.length)],
    amount: Math.floor(Math.random() * 200) + 30,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  }));
};

const weeklySalesData = [
  { day: "周一", sales: 12400 },
  { day: "周二", sales: 15800 },
  { day: "周三", sales: 18200 },
  { day: "周四", sales: 14600 },
  { day: "周五", sales: 21300 },
  { day: "周六", sales: 28450 },
  { day: "周日", sales: 22100 }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 347,
    sales: 28450,
    visitors: 8934,
    conversionRate: 3.89,
  });
  const [orders, setOrders] = useState(generateOrders());
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 动态数据增长效果
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        orders: prev.orders + Math.floor(Math.random() * 3),
        sales: prev.sales + Math.floor(Math.random() * 500) + 100,
        visitors: prev.visitors + Math.floor(Math.random() * 10) + 1,
        conversionRate: prev.conversionRate + (Math.random() * 0.1 - 0.02),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 订单自动滚动效果
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const newOrder = {
          id: `#ORD-${2900 + Math.floor(Math.random() * 100)}`,
          customer: ["Alex M.", "Jordan K.", "Chris L.", "Taylor R.", "Morgan S."][Math.floor(Math.random() * 5)],
          product: ["Urban Street Hoodie", "Oversized Tee", "Cargo Pants"][Math.floor(Math.random() * 3)],
          amount: Math.floor(Math.random() * 200) + 30,
          status: ["已完成", "处理中", "待付款"][Math.floor(Math.random() * 3)] as "已完成" | "处理中" | "待付款",
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };
        return [newOrder, ...prev.slice(0, 14)];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      label: "今日订单",
      value: stats.orders,
      icon: ShoppingBag,
      change: "+12.5%",
      trend: "up",
    },
    {
      label: "今日销售额",
      value: `¥${stats.sales.toLocaleString()}`,
      icon: DollarSign,
      change: "+8.2%",
      trend: "up",
    },
    {
      label: "今日访客",
      value: stats.visitors.toLocaleString(),
      icon: Users,
      change: "+15.3%",
      trend: "up",
    },
    {
      label: "转化率",
      value: `${stats.conversionRate.toFixed(2)}%`,
      icon: Target,
      change: "-0.4%",
      trend: "down",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">数据概览</h1>
        <p className="text-gray-400">欢迎回来，这是您店铺的整体运营情况 (2026年3月27日)</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6">本周销售趋势</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySalesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `¥${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`¥${Number(value).toLocaleString()}`, "销售额"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6">快速统计</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">商品总数</p>
                <p className="text-2xl font-bold">38</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">总销售额</p>
                <p className="text-2xl font-bold">¥{stats.sales.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">平均客单价</p>
                <p className="text-2xl font-bold">¥{Math.floor(stats.sales / Math.max(stats.orders, 1)).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">客户满意度</p>
                <p className="text-2xl font-bold">4.7/5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders - Auto Scrolling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl p-6 border border-border mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">最近订单</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-green-400">实时更新中</span>
          </div>
        </div>
        <div className="overflow-hidden h-[300px]" ref={scrollRef}>
          <div className="space-y-1">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{order.time}</span>
                  <span className="font-medium">{order.id}</span>
                  <span className="text-gray-400">{order.customer}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">{order.product}</span>
                  <span className="font-semibold">¥{order.amount}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "已完成" ? "bg-green-500/20 text-green-400" :
                    order.status === "处理中" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}