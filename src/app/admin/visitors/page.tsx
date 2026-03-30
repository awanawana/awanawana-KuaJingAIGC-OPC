"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, ShoppingBag, MapPin, Smartphone, Clock, DollarSign, Heart, Eye, Star, Globe, User, Activity } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// 访客数据
const demographicData = [
  { name: "18-24岁", value: 35, color: "#6366f1" },
  { name: "25-34岁", value: 45, color: "#8b5cf6" },
  { name: "35-44岁", value: 15, color: "#a78bfa" },
  { name: "45岁以上", value: 5, color: "#c4b5fd" },
];

const genderData = [
  { name: "男性", value: 58, color: "#3b82f6" },
  { name: "女性", value: 42, color: "#ec4899" },
];

const regionData = [
  { region: "广东", visitors: 23450, orders: 8920, revenue: 456780 },
  { region: "浙江", visitors: 18760, orders: 6540, revenue: 345600 },
  { region: "江苏", visitors: 15670, orders: 5430, revenue: 298700 },
  { region: "山东", visitors: 12340, orders: 4320, revenue: 234500 },
  { region: "四川", visitors: 10980, orders: 3870, revenue: 198700 },
  { region: "其他", visitors: 28780, orders: 9870, revenue: 543200 },
];

const sourceData = [
  { name: "自然搜索", value: 35, icon: "🔍" },
  { name: "社交媒体", value: 28, icon: "📱" },
  { name: "直接访问", value: 20, icon: "🌐" },
  { name: "广告投放", value: 12, icon: "📢" },
  { name: "外部链接", value: 5, icon: "🔗" },
];

const timeData = [
  { hour: "0时", visitors: 120 },
  { hour: "4时", visitors: 80 },
  { hour: "8时", visitors: 1250 },
  { hour: "12时", visitors: 2340 },
  { hour: "16时", visitors: 3120 },
  { hour: "20时", visitors: 2890 },
  { hour: "24时", visitors: 450 },
];

const purchaseData = [
  { category: "连帽衫", percentage: 28, avgPrice: 89, growth: "+15%" },
  { category: "T恤", percentage: 24, avgPrice: 45, growth: "+8%" },
  { category: "裤装", percentage: 22, avgPrice: 129, growth: "+12%" },
  { category: "外套", percentage: 15, avgPrice: 199, growth: "+5%" },
  { category: "配饰", percentage: 11, avgPrice: 35, growth: "+22%" },
];

export default function VisitorsPage() {
  const [liveVisitors, setLiveVisitors] = useState(847);
  const [totalVisitors, setTotalVisitors] = useState(256780);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => prev + Math.floor(Math.random() * 5) - 2);
      setTotalVisitors(prev => prev + Math.floor(Math.random() * 10) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">访客画像</h1>
            <p className="text-gray-400">深入了解您的客户群体 (2026年3月)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-card rounded-xl px-6 py-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-400">当前在线</span>
              </div>
              <p className="text-3xl font-bold text-green-400">{liveVisitors}</p>
            </div>
            <div className="bg-card rounded-xl px-6 py-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">累计访客</span>
              </div>
              <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "平均停留时间", value: "4分32秒", icon: Clock, color: "blue" },
          { label: "页面浏览量", value: "8.7", icon: Eye, color: "purple" },
          { label: "加购率", value: "34.5%", icon: ShoppingBag, color: "green" },
          { label: "客单价", value: "¥128", icon: DollarSign, color: "yellow" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-500/20' :
                stat.color === 'purple' ? 'bg-purple-500/20' :
                stat.color === 'green' ? 'bg-green-500/20' :
                'bg-yellow-500/20'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'purple' ? 'text-purple-400' :
                  stat.color === 'green' ? 'text-green-400' :
                  'text-yellow-400'
                }`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Age Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            年龄分布
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {demographicData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-400">{item.name}</span>
                <span className="text-sm font-medium ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gender Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-400" />
            性别分布
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {genderData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
                <div className="flex-1 mx-4 h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-400" />
            流量来源
          </h2>
          <div className="space-y-4">
            {sourceData.map((source, i) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2">
                    <span>{source.icon}</span>
                    <span className="text-sm">{source.name}</span>
                  </span>
                  <span className="text-sm font-medium">{source.value}%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.value}%` }}
                    transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Hourly Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6">24小时访客趋势</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <XAxis dataKey="hour" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8, fill: "#6366f1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Regions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-400" />
            热门地区
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <XAxis type="number" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="region" stroke="#666" fontSize={12} tickLine={false} axisLine={false} width={50} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="visitors" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Purchase Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-yellow-400" />
          购买品类分析
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {purchaseData.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="bg-background/50 rounded-xl p-4 border border-border/50 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{item.category}</span>
                <span className="text-green-400 text-sm">{item.growth}</span>
              </div>
              <div className="h-16 bg-primary/10 rounded-lg mb-3 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.8, delay: 1.1 + i * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-lg absolute left-0 top-0"
                ></motion.div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">占比 {item.percentage}%</span>
                <span className="text-gray-400">均价 ¥{item.avgPrice}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Push Notification Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-card rounded-2xl p-6 border border-border mt-8"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          推送通知管理
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "新品提醒", desc: "新商品上架时自动推送", enabled: true, icon: "🆕" },
            { title: "促销通知", desc: "折扣活动开始时推送", enabled: true, icon: "🔥" },
            { title: "库存警告", desc: "热销商品库存不足时提醒", enabled: false, icon: "⚠️" },
          ].map((notification, i) => (
            <div key={notification.title} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{notification.icon}</span>
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-400">{notification.desc}</p>
                </div>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notification.enabled ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notification.enabled ? "left-7" : "left-1"
                  }`}
                ></span>
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}