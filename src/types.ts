export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | '20' | '22' | '23';

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