import { NextRequest, NextResponse } from 'next/server';

const TIKTOK_API_BASE = 'https://open-api.tiktokglobalshop.com';

/**
 * POST /api/tiktok/auth/refresh
 * 刷新 access token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const refreshToken = body.refresh_token || request.cookies.get('tiktok_refresh_token')?.value;

    // 从 cookie 获取凭证
    const appKey = request.cookies.get('tiktok_app_key')?.value;
    const appSecret = request.cookies.get('tiktok_app_secret')?.value;

    if (!refreshToken || !appKey || !appSecret) {
      return NextResponse.json(
        { error: 'Missing refresh token or credentials' },
        { status: 400 }
      );
    }

    // 调用 TikTok Shop API 刷新 token
    const response = await fetch(`${TIKTOK_API_BASE}/api/v2/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: appKey,
        app_secret: appSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();

    if (data.code !== 0) {
      return NextResponse.json(
        { error: data.message || 'Failed to refresh token' },
        { status: 400 }
      );
    }

    // 返回新 token
    const responseData = NextResponse.json({
      success: true,
      expires_in: data.data.expires_in,
    });

    // 更新 cookie
    responseData.cookies.set('tiktok_access_token', data.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.data.expires_in,
    });

    responseData.cookies.set('tiktok_refresh_token', data.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.data.refresh_token_expires_in,
    });

    return responseData;
  } catch (error: any) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
