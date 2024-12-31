import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthenticatedCart } from "@/hooks/cart/useAuthenticatedCart";
import { useUnauthenticatedCart } from "@/hooks/cart/useUnauthenticatedCart";

const Cart = () => {
  // Get current session with no caching
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 0,
    cacheTime: 0,
  });

  // Use the appropriate cart hook based on authentication status
  const authenticatedCart = useAuthenticatedCart(session?.user?.id || '');
  const unauthenticatedCart = useUnauthenticatedCart();

  // Determine which cart data and operations to use
  const {
    cartItems,
    isLoading,
    updateQuantity,
    removeItem
  } = session?.user?.id ? authenticatedCart : unauthenticatedCart;

  const total = cartItems?.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0) ?? 0;

  if (isSessionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {!cartItems?.length ? (
              <EmptyCart />
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  userId={session?.user?.id || null}
                  onQuantityChange={(id, currentQuantity, delta) => {
                    const newQuantity = currentQuantity + delta;
                    if (newQuantity < 1) return;
                    updateQuantity(id, newQuantity);
                  }}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>
          
          <div className="lg:col-span-1">
            <CartSummary
              total={total}
              isAuthenticated={!!session}
              itemsExist={!!cartItems?.length}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;