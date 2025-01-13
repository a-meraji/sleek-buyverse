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
}

export const CartDrawerContent = ({
  cartItems,
  userId,
  updateQuantity,
  removeItem,
  total,
  isAuthenticated
}: CartDrawerContentProps) => {
  return (
    <div className="bg-background flex flex-col fixed right-0 top-0 h-full w-full sm:w-[400px] rounded-l-lg z-40">
      <CartHeader />
      <CartContent 
        cartItems={cartItems}
        userId={userId}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
      {cartItems?.length > 0 && (
        <div className="p-4 border-t">
          <CartSummary
            total={total}
            isAuthenticated={isAuthenticated}
            itemsExist={!!cartItems?.length}
          />
        </div>
      )}
    </div>
  );
};