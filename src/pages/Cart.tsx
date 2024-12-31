import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/cart/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      if (!session?.user?.id) {
        // For unauthenticated users, get items from context state
        console.log("Using local cart items from context:", state.items);
        return state.items;
      }
      
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
    enabled: true, // Always enabled to handle both authenticated and unauthenticated cases
  });

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session?.user?.id]);

  const handleQuantityChange = async (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    
    try {
      await updateQuantity(userId, id, newQuantity);
      await queryClient.invalidateQueries({ queryKey: ['cart', session?.user?.id] });
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeItem(userId, id);
      await queryClient.invalidateQueries({ queryKey: ['cart', session?.user?.id] });
      toast({
        title: "Item removed",
        description: "Item has been removed from cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
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