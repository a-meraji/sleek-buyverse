import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/cart/CartContext";
import { Navbar } from "@/components/Navbar";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { LoadingState } from "@/components/checkout/LoadingState";
import { EmptyCartState } from "@/components/checkout/EmptyCartState";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

const Checkout = () => {
  const navigate = useNavigate();
  const { state: { items }, updateQuantity: updateCartQuantity, removeItem: removeCartItem } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { total, subtotal, tax } = useOrderCalculations();

  console.log('Checkout page - Cart items:', items);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (userId) {
      updateCartQuantity(userId, id, quantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    if (userId) {
      removeCartItem(userId, id);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!items || items.length === 0) {
    return <EmptyCartState />;
  }

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <CheckoutHeader />
          <CheckoutContent 
            userId={userId}
            items={items}
            total={total}
            subtotal={subtotal}
            tax={tax}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveItem={handleRemoveItem}
          />
        </div>
      </main>
    </div>
  );
};

export default Checkout;
