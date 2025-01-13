import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/types";

interface CartTriggerProps {
  cartItems: CartItem[] | null;
  onClick: () => void;
}

export const CartTrigger = ({ cartItems, onClick }: CartTriggerProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="relative"
      onClick={onClick}
      aria-label="Open shopping cart"
    >
      <ShoppingCart className="h-4 w-4" />
      {cartItems?.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartItems.length}
        </span>
      )}
    </Button>
  );
};