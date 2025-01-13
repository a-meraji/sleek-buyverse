import { Drawer } from "vaul";
import { CartSummary } from "./CartSummary";
import { CartHeader } from "./CartHeader";
import { CartContent } from "./CartContent";
import { CartTrigger } from "./CartTrigger";
import { useCartDrawer } from "@/hooks/cart/useCartDrawer";
import { useEffect, useRef } from "react";

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

  // Track if cleanup is in progress
  const cleanupInProgress = useRef(false);

  // Cleanup effect for drawer overlay
  useEffect(() => {
    if (!isOpen) {
      console.log('Cart drawer closed, scheduling cleanup');
      
      // Prevent multiple cleanups
      if (cleanupInProgress.current) {
        console.log('Cleanup already in progress, skipping');
        return;
      }
      
      cleanupInProgress.current = true;

      // Small delay to ensure drawer animation completes
      const timeoutId = setTimeout(() => {
        console.log('Executing cart drawer overlay cleanup');
        try {
          // Remove overlay elements if they exist
          const overlays = document.querySelectorAll('[data-vaul-overlay]');
          overlays.forEach(overlay => {
            if (overlay?.parentNode) {
              console.log('Found overlay to remove');
              const portalContainer = overlay.parentNode;
              if (portalContainer?.parentNode) {
                console.log('Removing overlay container');
                portalContainer.parentNode.removeChild(portalContainer);
              }
            }
          });

          // Clean up portal roots if they exist
          const portalRoots = document.querySelectorAll('[data-vaul-drawer-portal]');
          portalRoots.forEach(root => {
            if (root?.parentNode) {
              console.log('Removing portal root');
              root.parentNode.removeChild(root);
            }
          });
        } catch (error) {
          console.error('Error during cleanup:', error);
        } finally {
          cleanupInProgress.current = false;
        }
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        cleanupInProgress.current = false;
      };
    }
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
    >
      <CartTrigger cartItems={cartItems} />
      <Drawer.Portal>
        <Drawer.Overlay 
          className="fixed inset-0 bg-black/40 z-40" 
          data-testid="cart-overlay"
        />
        <Drawer.Content className="bg-background flex flex-col fixed right-0 top-0 h-full w-full sm:w-[400px] rounded-l-lg z-40">
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