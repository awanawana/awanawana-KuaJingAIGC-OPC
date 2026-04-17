import { NextResponse } from 'next/server';

/**
 * POST /api/tiktok/auth/credentials
 * 保存凭证到 cookie
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { app_key, app_secret } = body;

    if (!app_key || !app_secret) {
      return NextResponse.json(
        { error: 'App Key and App Secret are required' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    // 保存到 cookie (短期存储，用于API调用)
    response.cookies.set('tiktok_app_key', app_key, {
      httpOnly: false, // 需要前端可读
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30天
    });

    response.cookies.set('tiktok_app_secret', app_secret, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error('Save credentials error:', error);
    return NextResponse.json(
      { error: 'Failed to save credentials' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tiktok/auth/credentials
 * 获取已保存的凭证状态
 */
export async function GET(request: Request) {
  const appKey = request.cookies.get('tiktok_app_key')?.value;

  return NextResponse.json({
    hasCredentials: !!appKey,
  });
}
