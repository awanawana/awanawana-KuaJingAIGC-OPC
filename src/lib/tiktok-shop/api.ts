// TikTok Shop API Service Module
import { tiktokApiRequest, getShopList, selectShop } from './auth';
import {
  TikTokProduct,
  CreateProductRequest,
  ProductCreateResponse,
  ProductPublishResponse,
  UploadResponse,
  Category,
  PublishStatus,
  Product,
} from './types';

/**
 * 上传商品图片到 TikTok Shop
 */
export async function uploadProductImage(imageUrl: string): Promise<UploadResponse> {
  // 首先下载图片为 base64
  const base64Image = await urlToBase64(imageUrl);

  const response = await tiktokApiRequest<UploadResponse>('/api/v2/media/upload', 'POST', {
    file_type: 'image',
    file_content: base64Image,
  });

  return response;
}

/**
 * 将 URL 转换为 Base64
 */
async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // 移除 data:image/xxx;base64, 前缀
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
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
export async function createProduct(product: CreateProductRequest): Promise<ProductCreateResponse> {
  const response = await tiktokApiRequest<ProductCreateResponse>('/api/v2/product/add', 'POST', product);
  return response;
}

/**
 * 更新商品
 */
export async function updateProduct(productId: string, product: Partial<CreateProductRequest>): Promise<{ product_id: string }> {
  const response = await tiktokApiRequest<{ product_id: string }>('/api/v2/product/update', 'POST', {
    product_id: productId,
    ...product,
  });
  return response;
}

/**
 * 发布商品到 TikTok Shop
 */
export async function publishProduct(productId: string): Promise<ProductPublishResponse> {
  const response = await tiktokApiRequest<ProductPublishResponse>('/api/v2/product/publish', 'POST', {
    product_id: productId,
  });
  return response;
}

/**
 * 获取商品详情
 */
export async function getProductDetail(productId: string): Promise<TikTokProduct> {
  const response = await tiktokApiRequest<{ product: TikTokProduct }>('/api/v2/product/get', 'GET', {
    product_id: productId,
  });
  return response.product;
}

/**
 * 获取商品列表
 */
export async function getProductList(page: number = 1, pageSize: number = 20): Promise<{ products: TikTokProduct[]; total_count: number }> {
  const response = await tiktokApiRequest<{ products: TikTokProduct[]; total_count: number }>(
    '/api/v2/product/list',
    'POST',
    {
      page,
      page_size: pageSize,
    }
  );
  return response;
}

/**
 * 获取商品类目列表
 */
export async function getCategoryList(parentId?: string): Promise<Category[]> {
  const response = await tiktokApiRequest<{ categories: Category[] }>(
    '/api/v2/product/category/get',
    'POST',
    {
      parent_category_id: parentId || '',
    }
  );
  return response.categories || [];
}

/**
 * 创建商品并发布 (完整流程)
 */
export async function createAndPublishProduct(localProduct: Product, listingData: {
  title: string;
  description: string;
  features: string;
}): Promise<PublishStatus> {
  try {
    // 1. 上传商品图片
    const imageIds: string[] = [];
    for (const imageUrl of localProduct.images) {
      try {
        const uploadResult = await uploadProductImage(imageUrl);
        imageIds.push(uploadResult.image_id);
      } catch (error) {
        console.error('Failed to upload image:', imageUrl, error);
        // 继续处理其他图片
      }
    }

    if (imageIds.length === 0) {
      throw new Error('No images uploaded successfully');
    }

    // 2. 构建商品数据
    const productData: CreateProductRequest = {
      category_id: getCategoryIdByName(localProduct.category),
      title: listingData.title || localProduct.name,
      description: listingData.description || localProduct.description,
      images: imageIds,
      skus: localProduct.colors.flatMap(color =>
        localProduct.sizes.map(size => ({
          seller_sku: `${localProduct.id}-${color}-${size}`,
          price: localProduct.price,
          stock: 100, // 默认库存
          attributes: {
            color: color,
            size: size,
          },
          image_url: localProduct.image,
        }))
      ),
    };

    // 3. 创建商品
    const createResult = await createProduct(productData);
    const productId = createResult.product_id;

    // 4. 发布商品
    await publishProduct(productId);

    return {
      product_id: localProduct.id,
      status: 'success',
      tts_product_id: productId,
    };
  } catch (error: any) {
    return {
      product_id: localProduct.id,
      status: 'failed',
      message: error.message,
    };
  }
}

/**
 * 根据类目名称获取 TikTok Shop 类目ID
 * 这里需要根据实际的类目映射来配置
 */
function getCategoryIdByName(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'Hoodies': '20000000', // 服装类目
    'T-Shirts': '20000000',
    'Pants': '20000000',
    'Jackets': '20000000',
    'Sweaters': '20000000',
    'Tops': '20000000',
    // 添加更多类目映射
  };

  return categoryMap[categoryName] || '20000000'; // 默认服装类目
}

/**
 * 检查授权状态
 */
export async function checkAuthStatus(): Promise<{ authorized: boolean; shops: any[] }> {
  try {
    const shops = await getShopList();
    return {
      authorized: shops.length > 0,
      shops,
    };
  } catch (error) {
    return {
      authorized: false,
      shops: [],
    };
  }
}

// 默认导出
export default {
  uploadProductImage,
  createProduct,
  updateProduct,
  publishProduct,
  getProductDetail,
  getProductList,
  getCategoryList,
  createAndPublishProduct,
  checkAuthStatus,
};
