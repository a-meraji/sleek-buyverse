import { CartContent } from "../CartContent";
import { CartHeader } from "../CartHeader";
import { CartSummary } from "../CartSummary";
import { CartItem } from "@/types";

interface CartDrawerContentProps {
  cartItems: CartItem[] | null;
  userId: string | null;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  total: number;
  isAuthenticated: boolean;
  onClose: () => void;
}

export const CartDrawerContent = ({
  cartItems,
  userId,
  updateQuantity,
  removeItem,
  total,
  isAuthenticated,
  onClose
}: CartDrawerContentProps) => {
  return (
    <div className="flex flex-col h-full">
      <CartHeader onClose={onClose} />
      <CartContent 
        cartItems={cartItems}
        userId={userId}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
      {cartItems?.length > 0 && (
        <div className="p-4 border-t mt-auto">
          <CartSummary
            total={total}
            isAuthenticated={isAuthenticated}
            itemsExist={!!cartItems?.length}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  );
};