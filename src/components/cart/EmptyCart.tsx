import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Drawer } from "vaul";

export const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <ShoppingCart className="h-16 w-16 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Your cart is empty</h2>
      <p className="text-muted-foreground">Add some items to your cart to get started</p>
      <Drawer.Close asChild>
        <Button 
          variant="outline" 
          onClick={() => {
            navigate('/products');
          }}
        >
          Continue Shopping
        </Button>
      </Drawer.Close>
    </div>
  );
};