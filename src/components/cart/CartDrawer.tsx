import { Drawer } from "vaul";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthenticatedCart } from "@/hooks/cart/useAuthenticatedCart";
import { useUnauthenticatedCart } from "@/hooks/cart/useUnauthenticatedCart";
import { useState, useEffect, useMemo } from "react";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 0,
    gcTime: 0
  });

  const authenticatedCart = useAuthenticatedCart(session?.user?.id || '');
  const unauthenticatedCart = useUnauthenticatedCart();

  const {
    cartItems,
    isLoading,
    updateQuantity,
    removeItem
  } = session?.user?.id ? authenticatedCart : unauthenticatedCart;

  // Keep track of previous cart items length
  const [prevCartLength, setPrevCartLength] = useState(cartItems?.length || 0);

  // Listen for storage events (for unauthenticated cart)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart' && !session?.user?.id) {
        console.log('Local storage cart updated:', e.newValue);
        // Force a re-render when localStorage changes
        unauthenticatedCart.refreshCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [session?.user?.id, unauthenticatedCart]);

  // Only open drawer when items are added
  useEffect(() => {
    const currentLength = cartItems?.length || 0;
    if (currentLength > prevCartLength) {
      console.log('Opening cart drawer - items changed:', { 
        currentLength, 
        prevCartLength 
      });
      setIsOpen(true);
    }
    setPrevCartLength(currentLength);
  }, [cartItems?.length]);

  // Memoize the total calculation
  const total = useMemo(() => {
    return cartItems?.reduce((sum, item) => {
      const variantPrice = item.product?.product_variants?.find(v => v.id === item.variant_id)?.price ?? 0;
      const discount = item.product?.discount;
      const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
      const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
      return sum + (discountedPrice * item.quantity);
    }, 0) ?? 0;
  }, [cartItems]);

  console.log('Cart drawer render:', {
    isAuthenticated: !!session?.user?.id,
    cartItemsCount: cartItems?.length,
    total,
    cartItems,
    isOpen
  });

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cartItems?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[48]" />
        <Drawer.Content className="bg-background flex flex-col fixed right-0 top-0 h-full w-full sm:w-[400px] rounded-l-lg z-[49]">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <Drawer.Close asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Close</span>
                  ×
                </Button>
              </Drawer.Close>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {!cartItems?.length ? (
              <EmptyCart />
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
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
                ))}
              </div>
            )}
          </div>

          {cartItems?.length > 0 && (
            <div className="p-4 border-t">
              <CartSummary
                total={total}
                isAuthenticated={!!session}
                itemsExist={!!cartItems?.length}
              />
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
