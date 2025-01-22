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
  selectedVariant: ProductVariant;
  finalSelectedVariantPrice: number;
  parameterKeys: string[];
}

export interface ProductImageProps {
  image: string;
  name: string;
  discount: number;
}
