import { useCartState } from "@/contexts/cart/hooks/useCartState";
import { CartContent } from "./CartContent";
import { CartHeader } from "./CartHeader";
import { useCartDrawer } from "@/hooks/cart/useCartDrawer";

export function CartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const { itemsExist, total, isAuthenticated } = useCartState();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50"
        onClick={close}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl">
        <div className="flex h-full flex-col">
          <CartHeader onClose={close} />
          <CartContent
            itemsExist={itemsExist}
            total={total}
            isAuthenticated={isAuthenticated}
            onClose={close}
          />
        </div>
      </div>
    </>
  );
}