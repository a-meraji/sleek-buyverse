import { Dispatch, SetStateAction } from 'react';
import { Product } from './types/product';
import { ProductVariant } from './types/variant';
import { ProductImage, ProductSize, Review } from './types/product';

export type { Product } from './types/product';
export type { ProductVariant } from './types/variant';
export type { ProductImage, ProductSize, Review } from './types/product';
export type { ProductFormProps } from './types/product';
export type { ProductFormContainerProps } from './types/product';

export interface CustomElement {
  type: string;
  children: CustomText[];
}

export interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface ProductDetailsProps {
  product: Product;
  userId: string;
  selectedSize: string;
  onSizeSelect: Dispatch<SetStateAction<string>>;
}

export interface VariantSelectionPanelProps {
  variants: ProductVariant[];
  selectedParameters: Record<string, string | number>;
  onParameterSelect: (key: string, value: string | number) => void;
  selectedVariant: ProductVariant | null;
  finalSelectedVariantPrice: number;
  parameterKeys: string[];
}

export interface ProductImageProps {
  image: string;
  name: string;
  discount?: number;
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
  userId?: string;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  readonly?: boolean;
}

export interface CartItemHeaderProps {
  name: string;
  variant?: ProductVariant;
  onRemove: () => void;
  readonly: boolean;
  productName: string;
  parameters?: string;
}

export interface CartItemPriceProps {
  price: number;
  quantity: number;
  discount?: number;
  variantPrice: number;
}