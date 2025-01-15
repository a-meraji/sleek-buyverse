import { CartSummary } from "@/components/cart/CartSummary";
import { useCartState } from "@/contexts/cart/hooks/useCartState";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthenticatedCart } from "@/hooks/cart/useAuthenticatedCart";
import { useUnauthenticatedCart } from "@/hooks/cart/useUnauthenticatedCart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CheckoutContent = () => {
  const navigate = useNavigate();
  const [state] = useCartState();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const authenticatedCart = useAuthenticatedCart(session?.user?.id || '');
  const unauthenticatedCart = useUnauthenticatedCart();

  const {
    cartItems,
  } = session?.user?.id ? authenticatedCart : unauthenticatedCart;

  useEffect(() => {
    if (!state.items?.length) {
      navigate('/cart');
    }
  }, [state.items, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Checkout form will go here */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
            {/* Add checkout form components here */}
          </div>
        </div>
        <div>
          <CartSummary
            total={0}
            isAuthenticated={true}
            itemsExist={true}
            onClose={() => {}}
            cartItems={cartItems}
          />
        </div>
      </div>
    </div>
  );
};