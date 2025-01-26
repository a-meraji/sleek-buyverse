import { ProductVariant } from "./variant";
import { ProductImage } from "./types";

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
  product_variants?: ProductVariant[];
  created_at?: string;
}

export interface ProductSize {
  id: string;
  name: string;
  value: string;
}

export interface Review {
  id: string;
  product_id: string;
  reviewer_id?: string;
  reviewer_first_name: string;
  reviewer_last_name: string;
  title: string;
  review_text: string;
  rating: number;
  status: string;
  created_at: string;
}

export interface ProductFormProps {
  onClose: () => void;
  initialData?: Product;
}

export interface ProductFormContainerProps {
  onClose: () => void;
  product?: Product;
}