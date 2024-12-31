import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/cart/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useQuery } from "@tanstack/react-query";

const Cart = () => {
  const { state: { items }, updateQuantity, removeItem } = useCart();
  const [userId, setUserId] = useState<string | null>(null);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      console.log("Fetching cart items for user:", session.user.id);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session?.user?.id]);

  const handleQuantityChange = async (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    await updateQuantity(userId, id, newQuantity);
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(userId, id);
  };

  const total = cartItems?.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0) ?? 0;

  if (isLoading) {
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
                  userId={userId}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
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