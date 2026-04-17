import { NextResponse } from 'next/server';
import { setToken, setShopInfo, getShopList, clearAuth } from '@/lib/tiktok-shop/auth';

// TikTok API Base URLs
const TIKTOK_API_BASE = 'https://open-api.tiktokglobalshop.com';
const TIKTOK_API_BASE_SANDBOX = 'https://open-api-sandbox.tiktokglobalshop.com';

/**
 * GET /api/tiktok/auth
 * 初始化授权流程，返回授权URL
 */
export async function GET(request: Request) {
  try {
    // 从 cookie 获取凭证
    const appKey = request.cookies.get('tiktok_app_key')?.value;
    const appSecret = request.cookies.get('tiktok_app_secret')?.value;

    // 也尝试从 localStorage 获取（前端直接调用时）
    let credentials = { app_key: appKey, app_secret: appSecret };

    if (!credentials.app_key || !credentials.app_secret) {
      return NextResponse.json(
        { error: '请先在设置页面配置 App Key 和 App Secret' },
        { status: 400 }
      );
    }

    // 构建授权URL
    const callbackUrl = process.env.NEXT_PUBLIC_TIKTOK_SHOP_CALLBACK_URL || 'http://localhost:3000/api/tiktok/auth/callback';
    const params = new URLSearchParams({
      app_key: credentials.app_key,
      redirect_uri: callbackUrl,
      state: generateState(),
      response_type: 'code',
    });

    const authUrl = `${TIKTOK_API_BASE}/api/v2/oauth/authorize?${params.toString()}`;

    return NextResponse.json({ authUrl });
  } catch (error: any) {
    console.error('Auth initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize authorization' },
      { status: 500 }
    );
  }
}

function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
