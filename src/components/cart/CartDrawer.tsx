import { useCartDrawer } from "@/hooks/cart/useCartDrawer";
import { CartTrigger } from "./CartTrigger";
import { CartDrawerContent } from "./drawer/CartDrawerContent";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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

  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && event.target === overlayRef.current) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <CartTrigger cartItems={cartItems} onClick={() => setIsOpen(true)} />
      
      <div 
        ref={overlayRef}
        className={cn(
          "fixed inset-0 bg-black/40 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />
      
      <div
        ref={drawerRef}
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-[400px] bg-background z-50",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <CartDrawerContent 
          cartItems={cartItems}
          userId={session?.user?.id || null}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          total={total}
          isAuthenticated={!!session}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
};