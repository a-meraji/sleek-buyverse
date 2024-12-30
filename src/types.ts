export type ProductSize = string;

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  stock?: number;
  category?: string;
  sku?: string;
  sizes?: ProductSize[];
}