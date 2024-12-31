import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/cart/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

const Cart = () => {
  const { state: { items, isLoading }, updateQuantity, removeItem, loadCartItems } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Memoize auth check to prevent unnecessary re-renders
  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Cart - Auth check:", session?.user?.id || "Not authenticated");
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    } catch (error) {
      console.error("Cart - Auth check error:", error);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("Cart - Loading items, isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      loadCartItems();
    }
  }, [isAuthenticated, loadCartItems]);

  const handleQuantityChange = async (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    await updateQuantity(userId, id, newQuantity);
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(userId, id);
  };

  const total = items?.reduce((sum, item) => {
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
            {items?.length === 0 ? (
              <EmptyCart />
            ) : (
              items?.map((item) => (
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
              isAuthenticated={isAuthenticated}
              itemsExist={items?.length > 0}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;