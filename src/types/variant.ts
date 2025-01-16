export interface ProductVariant {
  id: string;
  product_id: string;
  stock: number;
  price: number;
  parameters: Record<string, string | number>;
  created_at: string;
}