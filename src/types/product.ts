import { ProductVariant } from "./variant";
import { ProductImage } from "../types";

export type { Product } from "../types";

export interface ProductFormData extends Omit<Product, 'id'> {
  product_variants: ProductVariant[];
  product_images?: ProductImage[];
}