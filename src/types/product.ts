export interface Product {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  main_category?: string;
  secondary_categories?: string[];
  sku?: string;
  discount?: number;
  product_images?: ProductImage[];
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}