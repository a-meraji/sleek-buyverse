import { ProductVariant } from "./variant";
import { ProductImage } from "../types";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  stock?: number;
  category?: string;
  sku?: string;
  discount: number | null;
  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
}

export interface ProductFormData extends Omit<Product, 'id'> {
  product_variants: ProductVariant[];
  product_images?: ProductImage[];
}