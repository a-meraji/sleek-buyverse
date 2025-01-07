import { Button } from "@/components/ui/button";
import { Drawer } from "vaul";

export const CartHeader = () => {
  return (
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
  );
};