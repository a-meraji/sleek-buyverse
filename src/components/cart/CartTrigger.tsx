import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Drawer } from "vaul";
import { CartItem } from "@/types";

interface CartTriggerProps {
  cartItems: CartItem[] | null;
}

export const CartTrigger = ({ cartItems }: CartTriggerProps) => {
  return (
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
  );
};