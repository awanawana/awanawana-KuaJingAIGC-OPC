import { NextRequest, NextResponse } from 'next/server';

const TIKTOK_API_BASE = 'https://open-api.tiktokglobalshop.com';

/**
 * POST /api/tiktok/product/publish
 * 发布商品到 TikTok Shop
 */
export async function POST(request: NextRequest) {
  try {
    // 从 cookie 获取 access token
    const accessToken = request.cookies.get('tiktok_access_token')?.value;
    const shopId = request.cookies.get('tiktok_shop_id')?.value;
    const appKey = request.cookies.get('tiktok_app_key')?.value;
    const appSecret = request.cookies.get('tiktok_app_secret')?.value;

    if (!accessToken || !shopId) {
      return NextResponse.json(
        { error: '请先在设置页面授权 TikTok Shop' },
        { status: 401 }
      );
    }

    if (!appKey || !appSecret) {
      return NextResponse.json(
        { error: '请先在设置页面配置 API 凭证' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product, listing } = body;

    if (!product || !product.name) {
      return NextResponse.json(
        { error: '商品数据不能为空' },
        { status: 400 }
      );
    }

    // 构建 TikTok Shop 商品数据
    const tiktokProduct = await buildTikTokProduct(product, listing);

    // 1. 上传商品图片
    const imageIds: string[] = [];
    for (const imageUrl of product.images || []) {
      try {
        const imageId = await uploadImage(accessToken, imageUrl, appKey, appSecret, shopId);
        imageIds.push(imageId);
      } catch (error) {
        console.error('Failed to upload image:', imageUrl, error);
      }
    }

    if (imageIds.length === 0) {
      return NextResponse.json(
        { error: '商品图片上传失败' },
        { status: 400 }
      );
    }

    // 更新商品图片
    tiktokProduct.images = imageIds.map((id, index) => ({
      image_id: id,
      url: product.images[index],
    }));

    // 2. 创建商品
    const createResult = await createProduct(accessToken, shopId, tiktokProduct, appKey, appSecret);

    // 3. 发布商品
    const publishResult = await publishProduct(accessToken, shopId, createResult.product_id, appKey, appSecret);

    return NextResponse.json({
      success: true,
      product_id: createResult.product_id,
      status: publishResult.status,
    });
  } catch (error: any) {
    console.error('Publish product error:', error);
    return NextResponse.json(
      { error: error.message || '发布商品失败' },
      { status: 500 }
    );
  }
}

/**
 * 构建 TikTok Shop 商品数据
 */
async function buildTikTokProduct(product: any, listing: any) {
  // 获取类目ID
  const categoryId = getCategoryIdByName(product.category);

  // 构建 SKU 数据
  const skus = [];
  const sizes = product.sizes?.length ? product.sizes : ['One Size'];
  const colors = product.colors?.length ? product.colors : ['Default'];

  for (const color of colors) {
    for (const size of sizes) {
      skus.push({
        seller_sku: `${product.name.substring(0, 10)}-${color}-${size}`.replace(/\s+/g, ''),
        price: product.price || 9.99,
        stock: 100,
        attributes: {
          color: color,
          size: size,
        },
      });
    }
  }

  return {
    category_id: categoryId,
    title: listing?.title || product.name,
    description: listing?.description || product.description || listing?.features || '',
    brand: 'My Brand',
    skus,
  };
}

/**
 * 上传图片到 TikTok Shop
 */
async function uploadImage(accessToken: string, imageUrl: string, appKey: string, appSecret: string, shopId: string): Promise<string> {
  // 下载图片为 base64
  const base64Image = await urlToBase64(imageUrl);

  const response = await fetch(`${TIKTOK_API_BASE}/api/v2/media/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      file_type: 'image',
      file_content: base64Image,
    }),
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || 'Failed to upload image');
  }

  return data.data.image_id;
}

/**
 * URL 转 Base64
 */
async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting URL to base64:', error);
    throw error;
  }
}

/**
 * 创建商品
 */
async function createProduct(accessToken: string, shopId: string, product: any, appKey: string, appSecret: string) {
  const response = await fetch(`${TIKTOK_API_BASE}/api/v2/product/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'x-tts-shop-id': shopId,
    },
    body: JSON.stringify(product),
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || 'Failed to create product');
  }

  return data.data;
}

/**
 * 发布商品
 */
async function publishProduct(accessToken: string, shopId: string, productId: string, appKey: string, appSecret: string) {
  const response = await fetch(`${TIKTOK_API_BASE}/api/v2/product/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'x-tts-shop-id': shopId,
    },
    body: JSON.stringify({
      product_id: productId,
    }),
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || 'Failed to publish product');
  }

  return data.data;
}

/**
 * 类目映射
 */
function getCategoryIdByName(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'Hoodies': '20000000',
    'T-Shirts': '20000000',
    'T-Shirt': '20000000',
    'Pants': '20000000',
    'Jackets': '20000000',
    'Jacket': '20000000',
    'Sweaters': '20000000',
    'Sweater': '20000000',
    'Tops': '20000000',
    'Dresses': '20000000',
    'Shorts': '20000000',
    'Skirts': '20000000',
    'Accessories': '20010000',
    'Bags': '20010000',
    'Shoes': '20020000',
  };

  return categoryMap[categoryName] || '20000000';
}
