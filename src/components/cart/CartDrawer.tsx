import { useCartState } from "@/contexts/cart/hooks/useCartState";
import { CartContent } from "./CartContent";
import { CartHeader } from "./CartHeader";
import { useCartDrawer } from "@/hooks/cart/useCartDrawer";
import { CartTrigger } from "./CartTrigger";
import { CartDrawerContent } from "./drawer/CartDrawerContent";

export function CartDrawer() {
  const {
    isOpen,
    setIsOpen,
    session,
    cartItems,
    updateQuantity,
    removeItem,
    total
  } = useCartDrawer();

  return (
    <>
      <CartTrigger 
        cartItems={cartItems} 
        onClick={() => setIsOpen(true)} 
      />
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl">
            <CartDrawerContent
              cartItems={cartItems}
              userId={session?.user?.id || null}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              total={total}
              isAuthenticated={!!session?.user}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </>
      )}
    </>
  );
}