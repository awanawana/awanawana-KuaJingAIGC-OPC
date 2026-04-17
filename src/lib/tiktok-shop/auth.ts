// TikTok Shop Authentication Module
import { TikTokShopConfig, TokenResponse, Shop, AuthState } from './types';

const TIKTOK_SHOP_API_BASE = 'https://open-api.tiktokglobalshop.com';

// 环境变量
const APP_KEY = process.env.NEXT_PUBLIC_TIKTOK_SHOP_APP_KEY || '';
const APP_SECRET = process.env.TIKTOK_SHOP_APP_SECRET || '';
const CALLBACK_URL = process.env.NEXT_PUBLIC_TIKTOK_SHOP_CALLBACK_URL || 'http://localhost:3000/api/tiktok/auth/callback';

// 存储 token 的简单方式 (生产环境应该用数据库)
let tokenCache: {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  shop?: Shop;
} = {};

/**
 * 获取授权URL
 */
export function getAuthorizationUrl(state?: string): string {
  const shopifyAuthUrl = 'https://account.shopify.com/store-connect/oauth/authorize';

  // TikTok Shop 使用不同的授权流程
  // 这里使用 Partner OAuth 2.0 流程
  const params = new URLSearchParams({
    app_key: APP_KEY,
    redirect_uri: CALLBACK_URL,
    state: state || generateState(),
    response_type: 'code',
  });

  return `${TIKTOK_SHOP_API_BASE}/api/v2/token/get?${params.toString()}`;
}

/**
 * 通过 authorization code 获取 token
 */
export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const response = await fetch(`${TIKTOK_SHOP_API_BASE}/api/v2/token/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      auth_code: code,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(`Failed to exchange code for token: ${data.message}`);
  }

  // 缓存 token
  tokenCache = {
    access_token: data.data.access_token,
    refresh_token: data.data.refresh_token,
    expires_at: Date.now() + (data.data.expires_in * 1000),
  };

  return data.data;
}

/**
 * 刷新 access token
 */
export async function refreshAccessToken(): Promise<TokenResponse | null> {
  if (!tokenCache.refresh_token) {
    return null;
  }

  try {
    const response = await fetch(`${TIKTOK_SHOP_API_BASE}/api/v2/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: APP_KEY,
        app_secret: APP_SECRET,
        refresh_token: tokenCache.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();

    if (data.code !== 0) {
      console.error('Failed to refresh token:', data.message);
      return null;
    }

    // 更新缓存
    tokenCache = {
      ...tokenCache,
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires_at: Date.now() + (data.data.expires_in * 1000),
    };

    return data.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * 检查 token 是否有效
 */
export function isTokenValid(): boolean {
  if (!tokenCache.access_token) {
    return false;
  }
  if (!tokenCache.expires_at) {
    return true; // 没有过期时间，认为有效
  }
  return Date.now() < tokenCache.expires_at;
}

/**
 * 获取当前 access token
 */
export function getAccessToken(): string | undefined {
  return tokenCache.access_token;
}

/**
 * 设置 token 信息
 */
export function setToken(token: string, refreshToken: string, expiresIn: number, shopId: string): void {
  tokenCache = {
    access_token: token,
    refresh_token: refreshToken,
    expires_at: Date.now() + (expiresIn * 1000),
  };
}

/**
 * 获取授权状态
 */
export function getAuthState(): AuthState {
  return {
    isAuthorized: isTokenValid(),
    accessToken: tokenCache.access_token,
    expiresAt: tokenCache.expires_at,
    shop: tokenCache.shop,
  };
}

/**
 * 设置店铺信息
 */
export function setShopInfo(shop: Shop): void {
  tokenCache.shop = shop;
}

/**
 * 清除授权信息 (退出登录)
 */
export function clearAuth(): void {
  tokenCache = {};
}

/**
 * 生成 state 参数
 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * 调用 TikTok Shop API 的通用方法
 */
export async function tiktokApiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
): Promise<T> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Not authenticated. Please authorize first.');
  }

  const response = await fetch(`${TIKTOK_SHOP_API_BASE}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (data.code !== 0) {
    // 如果是 token 过期，尝试刷新
    if (data.code === 401 || data.message?.includes('token')) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // 重试请求
        return tiktokApiRequest<T>(endpoint, method, body);
      }
    }
    throw new Error(`TikTok Shop API error: ${data.message}`);
  }

  return data.data;
}

/**
 * 获取商家店铺列表
 */
export async function getShopList(): Promise<Shop[]> {
  const data = await tiktokApiRequest<{ shops: Shop[] }>('/api/v2/shop/get');
  return data.shops || [];
}

/**
 * 选择店铺
 */
export async function selectShop(shopId: string): Promise<void> {
  const shops = await getShopList();
  const shop = shops.find(s => s.shop_id === shopId);
  if (shop) {
    setShopInfo(shop);
  }
}

// 默认导出
export default {
  getAuthorizationUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  isTokenValid,
  getAccessToken,
  getAuthState,
  setShopInfo,
  clearAuth,
  tiktokApiRequest,
  getShopList,
  selectShop,
};
