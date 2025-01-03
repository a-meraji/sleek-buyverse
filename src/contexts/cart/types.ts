export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    image_url: string;
    description?: string;
    product_variants?: Array<{
      id: string;
      price: number;
      size: string;
      color: string;
      stock: number;
    }>;
  };
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

export type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

export interface CartContextType {
  state: CartState;
  addToCart: (userId: string | null, item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (userId: string | null, id: string, quantity: number) => Promise<void>;
  removeItem: (userId: string | null, id: string) => Promise<void>;
}