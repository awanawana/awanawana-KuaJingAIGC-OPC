import { NextRequest, NextResponse } from 'next/server';

const TIKTOK_API_BASE = 'https://open-api.tiktokglobalshop.com';

/**
 * GET /api/tiktok/auth/callback
 * 处理 OAuth 回调，交换授权码获取 token
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // 如果有错误
    if (error) {
      const errorDescription = searchParams.get('error_description') || error;
      return NextResponse.redirect(new URL(`/admin/settings/tiktok?error=${encodeURIComponent(errorDescription)}`, request.url));
    }

    // 缺少授权码
    if (!code) {
      return NextResponse.redirect(new URL('/admin/settings/tiktok?error=No authorization code received', request.url));
    }

    // 从 cookie 获取凭证
    const appKey = request.cookies.get('tiktok_app_key')?.value;
    const appSecret = request.cookies.get('tiktok_app_secret')?.value;

    if (!appKey || !appSecret) {
      return NextResponse.redirect(new URL('/admin/settings/tiktok?error=Credentials not found', request.url));
    }

    // 用授权码换取 access token
    const tokenResponse = await exchangeCodeForToken(code, appKey, appSecret);

    // 将 token 存储到 cookie
    const response = NextResponse.redirect(new URL('/admin/settings/tiktok?success=authorized', request.url));

    response.cookies.set('tiktok_access_token', tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.expires_in,
    });

    response.cookies.set('tiktok_refresh_token', tokenResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.refresh_token_expires_in,
    });

    response.cookies.set('tiktok_shop_id', tokenResponse.shop_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.refresh_token_expires_in,
    });

    return response;
  } catch (error: any) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL(`/admin/settings/tiktok?error=${encodeURIComponent(error.message)}`, request.url));
  }
}

/**
 * 交换授权码获取 access token
 */
async function exchangeCodeForToken(code: string, appKey: string, appSecret: string) {
  const response = await fetch(`${TIKTOK_API_BASE}/api/v2/token/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_key: appKey,
      app_secret: appSecret,
      auth_code: code,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || 'Failed to exchange code for token');
  }

  return data.data;
}
