// TikTok Shop API Types

export interface TikTokShopConfig {
  app_key: string;
  app_secret: string;
  access_token?: string;
  refresh_token?: string;
  shop_id?: string;
  merchant_id?: string;
}

// OAuth Token Response
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
  token_type: string;
  shop_id: string;
}

// Shop Info
export interface Shop {
  shop_id: string;
  shop_name: string;
  region: string;
  status: string;
  is_primary: boolean;
}

// Product Types
export interface TikTokProduct {
  product_id?: string;
  category_id: string;
  title: string;
  description: string;
  images: ProductImage[];
  videos?: ProductVideo[];
  brand?: string;
  manufacturer?: Manufacturer;
  attributes?: ProductAttribute[];
  skus: SKU[];
  package_weight?: number;
  package_length?: number;
  package_width?: number;
  package_height?: number;
}

export interface ProductImage {
  image_id: string;
  url: string;
}

export interface ProductVideo {
  video_id: string;
  url: string;
}

export interface Manufacturer {
  manufacturer_id?: string;
  name: string;
  address?: string;
}

export interface ProductAttribute {
  attribute_id: string;
  attribute_name: string;
  attribute_values: string[];
}

export interface SKU {
  sku_id?: string;
  seller_sku: string;
  price: number;
  stock: number;
  attributes: SKUAttribute[];
  image?: ProductImage;
}

export interface SKUAttribute {
  attribute_id: string;
  attribute_name: string;
  attribute_value: string;
}

// Product Create/Update Request
export interface CreateProductRequest {
  category_id: string;
  title: string;
  description: string;
  images: string[];
  brand?: string;
  attributes?: Record<string, string[]>;
  skus: CreateSKURequest[];
}

export interface CreateSKURequest {
  seller_sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  image_url?: string;
}

// API Response Types
export interface TikTokAPIResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  request_id: string;
}

export interface ProductCreateResponse {
  product_id: string;
  task_id?: string;
}

export interface ProductPublishResponse {
  product_id: string;
  status: string;
  message?: string;
}

// Category
export interface Category {
  category_id: string;
  category_name: string;
  parent_id?: string;
  level: number;
  is_leaf: boolean;
}

// Auth State
export interface AuthState {
  isAuthorized: boolean;
  shop?: Shop;
  accessToken?: string;
  expiresAt?: number;
}

// Upload Response
export interface UploadResponse {
  image_id: string;
  url: string;
}

// Publish Status
export interface PublishStatus {
  product_id: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  message?: string;
  tts_product_id?: string;
}

// 本地商品到TikTok商品的映射配置
export interface ProductMappingConfig {
  categoryMap: Record<string, string>;  // 本地类目 -> TikTok类目ID
  attributeMap: Record<string, string>; // 本地属性 -> TikTok属性ID
}
