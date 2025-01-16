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
  userId?: string;
}

export interface CartItemPriceProps {
  variantPrice: number;
  quantity: number;
  discount?: number | null;
}

export interface CartItemHeaderProps {
  productName: string;
  parameters?: string;
  onRemove: () => void;
  readonly?: boolean;
}

export interface ProductImageProps {
  image: string;
  name: string;
  discount?: number | null;
  className?: string;
}

export interface DialogTitleProps {
  userId: string | null;
  productId: string;
  className?: string;
}

export interface ProductDetailsProps {
  product: Product;
  userId: string | null;
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
  selectedVariant?: ProductVariant;
}

export interface VariantSelectionPanelProps {
  variants: ProductVariant[];
  selectedParameters: Record<string, string | number>;
  onParameterSelect: (key: string, value: string | number) => void;
  selectedVariant?: ProductVariant;
  finalSelectedVariantPrice?: number;
  parameterKeys: string[];
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
  status: "approved" | "pending" | "rejected";
  created_at: string;
}