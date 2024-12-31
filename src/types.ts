export type ProductSize = string;

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  stock?: number;
  category?: string;
  sku?: string;
  product_variants?: ProductVariant[];
}