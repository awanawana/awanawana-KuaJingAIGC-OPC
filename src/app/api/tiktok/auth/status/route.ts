import { NextResponse } from 'next/server';

/**
 * GET /api/tiktok/auth/status
 * 检查授权状态
 */
export async function GET(request: Request) {
  try {
    const accessToken = request.cookies.get('tiktok_access_token')?.value;
    const shopId = request.cookies.get('tiktok_shop_id')?.value;

    if (!accessToken || !shopId) {
      return NextResponse.json({
        authorized: false,
      });
    }

    // 尝试获取店铺信息验证 token 有效性
    const response = await fetch('https://open-api.tiktokglobalshop.com/api/v2/shop/get', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.code === 0 && data.data?.shops?.length > 0) {
      const shop = data.data.shops.find((s: any) => s.shop_id === shopId);
      return NextResponse.json({
        authorized: true,
        shopId: shopId,
        shopName: shop?.shop_name || 'Unknown Shop',
      });
    }

    // Token 可能过期了
    return NextResponse.json({
      authorized: false,
    });
  } catch (error) {
    console.error('Check auth status error:', error);
    return NextResponse.json({
      authorized: false,
    });
  }
}
