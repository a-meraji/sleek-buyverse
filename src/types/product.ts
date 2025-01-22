import { ProductVariant } from "./variant";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
  sku?: string;
  discount?: number | null;
  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface ProductFormData extends Omit<Product, 'id'> {
  product_variants: ProductVariant[];
  product_images?: ProductImage[];
}

export interface ProductFormProps {
  onClose: () => void;
  initialData?: Product;
}

export interface ProductFormContainerProps {
  onClose: () => void;
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