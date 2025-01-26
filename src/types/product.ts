import { ProductVariant } from "./variant";

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
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
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

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

export interface ProductFormProps {
  onClose: () => void;
  initialData?: Product;
}

export interface ProductFormContainerProps {
  onClose: () => void;
  product?: Product;
}

export interface ProductContainerProps {
  product: Product;
  userId?: string | null;
}