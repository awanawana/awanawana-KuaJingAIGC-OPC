import { NextResponse } from 'next/server';

/**
 * POST /api/tiktok/auth/logout
 * 断开 TikTok Shop 连接
 */
export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ success: true });

    // 清除所有相关的 cookie
    response.cookies.set('tiktok_access_token', '', { maxAge: 0 });
    response.cookies.set('tiktok_refresh_token', '', { maxAge: 0 });
    response.cookies.set('tiktok_shop_id', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
