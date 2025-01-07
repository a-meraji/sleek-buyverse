import { Drawer } from "vaul";
import { CartSummary } from "./CartSummary";
import { CartHeader } from "./CartHeader";
import { CartContent } from "./CartContent";
import { CartTrigger } from "./CartTrigger";
import { useCartDrawer } from "@/hooks/cart/useCartDrawer";
import { useEffect } from "react";

export const CartDrawer = () => {
  const {
    isOpen,
    setIsOpen,
    session,
    cartItems,
    isLoading,
    updateQuantity,
    removeItem,
    total
  } = useCartDrawer();

  // Cleanup effect for drawer overlay
  useEffect(() => {
    const cleanup = () => {
      console.log('Cleaning up cart drawer overlay');
      const overlay = document.querySelector('[data-vaul-overlay]');
      if (overlay) {
        overlay.remove();
      }
    };

    if (!isOpen) {
      // Small delay to ensure drawer animation completes
      setTimeout(cleanup, 300);
    }

    return () => {
      cleanup();
    };
  }, [isOpen]);

  console.log('Cart drawer render:', {
    isAuthenticated: !!session?.user?.id,
    cartItemsCount: cartItems?.length,
    total,
    cartItems,
    isOpen
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Drawer.Root 
      open={isOpen} 
      onOpenChange={(open) => {
        console.log('Cart drawer open state changing to:', open);
        setIsOpen(open);
      }} 
      className="z-40"
    >
      <CartTrigger cartItems={cartItems} />
      <Drawer.Portal>
        <Drawer.Overlay 
          className="fixed inset-0 bg-black/40 z-40" 
          data-testid="cart-overlay"
        />
        <Drawer.Content className="bg-background flex flex-col fixed right-0 top-0 h-full w-full sm:w-[400px] rounded-l-lg">
          <CartHeader />
          <CartContent 
            cartItems={cartItems}
            userId={session?.user?.id || null}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
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