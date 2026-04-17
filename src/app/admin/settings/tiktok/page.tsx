"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Store, CheckCircle, XCircle, RefreshCw, ExternalLink, Loader2, Save, Key, Eye, EyeOff, Link2 } from "lucide-react";

// 存储凭证的key
const CREDENTIALS_KEY = 'tiktok_shop_credentials';

// TikTok Shop 商家后台地址
const TIKTOK_SHOP_CENTER_URL = 'https://sellercenter.tiktok.com';
const TIKTOK_PARTNER_URL = 'https://partner.tiktok.com';
const TIKTOK_API_DOCS_URL = 'https://partner.tiktok.com/v1/api/docs/tts';

interface TikTokCredentials {
  app_key: string;
  app_secret: string;
}

function TikTokSettingsContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [authStatus, setAuthStatus] = useState<{
    authorized: boolean;
    shopName?: string;
    shopId?: string;
  }>({ authorized: false });

  const [credentials, setCredentials] = useState<TikTokCredentials>({
    app_key: '',
    app_secret: '',
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // 加载保存的凭证
  useEffect(() => {
    const saved = localStorage.getItem(CREDENTIALS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCredentials(parsed);
      } catch (e) {
        console.error('Failed to parse saved credentials');
      }
    }

    // 检查 URL 参数显示消息
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success) {
      setMessage({ type: 'success', text: success });
    } else if (error) {
      setMessage({ type: 'error', text: error });
    }

    // 检查授权状态
    checkAuthStatus();
  }, [searchParams]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/tiktok/auth/status', {
        credentials: 'include',
      });
      const data = await response.json();
      setAuthStatus({
        authorized: data.authorized,
        shopName: data.shopName,
        shopId: data.shopId,
      });
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  };

  const handleSaveCredentials = async () => {
    if (!credentials.app_key || !credentials.app_secret) {
      setMessage({ type: 'error', text: '请填写 App Key 和 App Secret' });
      return;
    }

    setIsSaving(true);
    try {
      // 保存到 localStorage
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));

      // 同时保存到后端 API (如果需要)
      await fetch('/api/tiktok/auth/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      setMessage({ type: 'success', text: '凭证已保存' });
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthorize = async () => {
    // 先确保凭证已保存
    if (!credentials.app_key || !credentials.app_secret) {
      setMessage({ type: 'error', text: '请先填写并保存 App Key 和 App Secret' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tiktok/auth');
      const data = await response.json();

      if (data.authUrl) {
        // 跳转到 TikTok 授权页面
        window.location.href = data.authUrl;
      } else {
        setMessage({ type: 'error', text: data.error || '获取授权链接失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '启动授权失败' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/tiktok/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setAuthStatus({ authorized: false });
      setMessage({ type: 'success', text: '已断开 TikTok Shop 连接' });
    } catch (error) {
      setMessage({ type: 'error', text: '断开连接失败' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">TikTok Shop 设置</h1>
        <p className="text-gray-400">连接您的 TikTok Shop 店铺以上品</p>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          {message.text}
        </motion.div>
      )}

      {/* Credentials Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">API 凭证配置</h2>
        </div>

        {/* 快速入口 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <a
            href={TIKTOK_SHOP_CENTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#FE2C55]/20 hover:bg-[#FE2C55]/30 text-[#FE2C55] rounded-lg text-sm transition-colors"
          >
            <Store className="w-4 h-4" />
            商家后台
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={TIKTOK_PARTNER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors"
          >
            <Link2 className="w-4 h-4" />
            Partner平台
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={TIKTOK_API_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
          >
            <Key className="w-4 h-4" />
            API文档
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          在 TikTok Shop Partner 平台创建应用后获取App Key和App Secret，然后点击上方「商家后台」或「Partner平台」进行授权。
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">App Key</label>
            <input
              type="text"
              value={credentials.app_key}
              onChange={(e) => setCredentials({ ...credentials, app_key: e.target.value })}
              placeholder="请输入 App Key"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">App Secret</label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={credentials.app_secret}
                onChange={(e) => setCredentials({ ...credentials, app_secret: e.target.value })}
                placeholder="请输入 App Secret"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveCredentials}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            保存凭证
          </button>
        </div>
      </motion.div>

      {/* Connection Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FE2C55] rounded-xl flex items-center justify-center">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">店铺连接</h2>
              <p className="text-gray-400 text-sm">
                {authStatus.authorized
                  ? `已连接: ${authStatus.shopName}`
                  : '未连接'}
              </p>
            </div>
          </div>

          {authStatus.authorized ? (
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="px-4 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              断开连接
            </button>
          ) : (
            <button
              onClick={handleAuthorize}
              disabled={isLoading}
              className="px-6 py-3 bg-[#FE2C55] hover:bg-[#FE2C55]/80 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ExternalLink className="w-5 h-5" />
              )}
              连接店铺
            </button>
          )}
        </div>
      </motion.div>

      {/* Instructions */}
      {!authStatus.authorized && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-card rounded-2xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">如何使用？</h3>
          <ol className="space-y-3 text-gray-400">
            <li className="flex gap-3">
              <span className="text-primary font-semibold">1.</span>
              填写上方的 App Key 和 App Secret 并保存
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">2.</span>
              点击「连接店铺」跳转到 TikTok 授权页面
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">3.</span>
              使用您的 TikTok Shop 商家账号登录并授权
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">4.</span>
              授权完成后即可在 AI 上品页面发布商品
            </li>
          </ol>
        </motion.div>
      )}

      {/* Connected Info */}
      {authStatus.authorized && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-card rounded-2xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">已连接店铺信息</h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-400">店铺名称</span>
              <span>{authStatus.shopName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">店铺 ID</span>
              <span className="font-mono text-sm">{authStatus.shopId}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              连接成功！现在可以在 AI 上品页面发布商品到 TikTok Shop
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function TikTokSettingsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <TikTokSettingsContent />
    </Suspense>
  );
}
