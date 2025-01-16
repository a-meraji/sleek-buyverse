export interface ProductVariant {
  id: string;
  product_id: string;
  stock: number;
  price: number;
  parameters: {
    [key: string]: string | number | undefined;
  };
  created_at: string;
}