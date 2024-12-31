import { ProductVariant } from "./variant";

export interface Product {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  category?: string;
  sku?: string;
  product_variants?: ProductVariant[];
}

export interface ProductFormData extends Omit<Product, 'id'> {
  variants: ProductVariant[];
}