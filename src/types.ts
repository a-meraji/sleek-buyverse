export type { ProductVariant } from './types/variant';
export type ProductSize = string;

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
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
  discount?: number | null;
  product_variants?: ProductVariant[];
  product_images?: ProductImage[];
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface CartItemProps {
  item: CartItem;
  onQuantityChange: (id: string, currentQuantity: number, delta: number) => void;
  onRemove: (id: string) => void;
  readonly?: boolean;
}

export interface ProductImageProps {
  image: string;
  name: string;
  discount?: number;
}

export interface DialogTitleProps {
  userId: string;
  productId: string;
  className?: string;
}

export interface ProductDetailsProps {
  product: Product;
  userId: string;
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
}