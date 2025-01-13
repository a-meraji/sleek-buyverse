import { Drawer } from "vaul";
import { CartTrigger } from "./CartTrigger";
import { useCartDrawer } from "@/hooks/cart/useCartDrawer";
import { CartDrawerContent } from "./drawer/CartDrawerContent";
import { useCartCleanup } from "./drawer/useCartCleanup";

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

  useCartCleanup(isOpen);

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
        <Drawer.Content>
          <CartDrawerContent 
            cartItems={cartItems}
            userId={session?.user?.id || null}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            total={total}
            isAuthenticated={!!session}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};