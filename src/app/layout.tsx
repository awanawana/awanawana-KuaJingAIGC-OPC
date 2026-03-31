import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NEXUS - 跨境服装电商独立站 | AI智能选品运营",
    template: "%s | NEXUS",
  },
  description: "专业的跨境服装电商平台，AI智能选品、销量预测、竞品分析，助力跨境卖家高效运营。输入类目关键词，智能分析市场需求、竞争强度、利润空间，输出潜力商品推荐。",
  keywords: [
    "跨境电商",
    "服装电商",
    "AI选品",
    "电商运营",
    "销量预测",
    "竞品分析",
    "Amazon运营",
    "独立站",
    "DTC",
    "服装批发"
  ],
  authors: [{ name: "NEXUS Team" }],
  creator: "NEXUS",
  publisher: "NEXUS",
  metadataBase: new URL("https://nexus.example.com"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://nexus.example.com",
    siteName: "NEXUS",
    title: "NEXUS - 跨境服装电商独立站 | AI智能选品运营",
    description: "专业的跨境服装电商平台，AI智能选品、销量预测、竞品分析，助力跨境卖家高效运营。",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NEXUS - 跨境服装电商平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS - 跨境服装电商独立站 | AI智能选品运营",
    description: "专业的跨境服装电商平台，AI智能选品、销量预测、竞品分析",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}