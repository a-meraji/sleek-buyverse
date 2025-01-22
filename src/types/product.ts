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

export interface ProductSize {
  label: string;
  value: string;
}

export interface ProductFormProps {
  onClose: () => void;
  initialData?: Product;
}

export interface ProductFormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}