import { FC } from "react";
import { CartContent } from "@/components/cart/CartContent";
import { CartSummary } from "@/components/cart/CartSummary";
import { ProfileForm } from "@/components/navbar/ProfileForm";
import { CartItem } from "@/types";

interface CheckoutContentProps {
  userId: string;
  items: CartItem[];
  total: number;
  handleUpdateQuantity: (id: string, quantity: number) => void;
  handleRemoveItem: (id: string) => void;
}

export const CheckoutContent: FC<CheckoutContentProps> = ({
  userId,
  items,
  total,
  handleUpdateQuantity,
  handleRemoveItem,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left column - Forms */}
      <div className="lg:col-span-7 space-y-8">
        <section aria-labelledby="shipping-heading" className="bg-card rounded-lg p-6 shadow-sm">
          <h2 id="shipping-heading" className="text-xl font-semibold mb-6">
            Shipping Information
          </h2>
          <ProfileForm userId={userId} onClose={() => {}} />
        </section>
      </div>

      {/* Right column - Order summary */}
      <div className="lg:col-span-5 space-y-6">
        <section aria-labelledby="order-heading" className="bg-card rounded-lg shadow-sm divide-y">
          <h2 id="order-heading" className="sr-only">Order summary</h2>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <CartContent 
              cartItems={items} 
              userId={userId}
              updateQuantity={handleUpdateQuantity}
              removeItem={handleRemoveItem}
              readonly={true}
            />
          </div>

          <div className="p-6">
            <CartSummary 
              total={total}
              isAuthenticated={!!userId}
              itemsExist={items.length > 0}
              onClose={() => {}}
            />
          </div>
        </section>
      </div>
    </div>
  );
};