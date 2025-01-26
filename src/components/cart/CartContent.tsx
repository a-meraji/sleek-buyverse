import { CartItem } from "./CartItem";
import { EmptyCart } from "./EmptyCart";
import { CartItem as CartItemType } from "@/types";

interface CartContentProps {
  cartItems: CartItemType[] | null;
  userId: string | null;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  readonly?: boolean;
}

export const CartContent = ({ 
  cartItems, 
  userId, 
  updateQuantity, 
  removeItem,
  readonly = false
}: CartContentProps) => {
  return (
    <div className="flex-1 overflow-auto p-4 bg-gray-50">
      {!cartItems?.length ? (
        <EmptyCart />
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              userId={userId}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
              readonly={readonly}
            />
          ))}
        </div>
      )}
    </div>
  );
};