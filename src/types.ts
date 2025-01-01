export type ProductSize = string;

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  stock?: number;
  category?: string;
  sku?: string;
  discount: number | null;
  created_at?: string;
  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
}