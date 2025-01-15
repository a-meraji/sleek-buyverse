import { CartSummary } from "@/components/cart/CartSummary";
import { CartContent } from "@/components/cart/CartContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthenticatedCart } from "@/hooks/cart/useAuthenticatedCart";
import { useUnauthenticatedCart } from "@/hooks/cart/useUnauthenticatedCart";

export const CheckoutContent = () => {
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
    updateQuantity,
    removeItem,
  } = session?.user?.id ? authenticatedCart : unauthenticatedCart;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
          <CartContent 
            cartItems={cartItems}
            userId={session?.user?.id || null}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            readonly={false}
          />
        </div>
      </div>
      <div>
        <CartSummary
          total={0}
          isAuthenticated={!!session}
          itemsExist={!!cartItems?.length}
          onClose={() => {}}
          cartItems={cartItems}
        />
      </div>
    </div>
  );
};