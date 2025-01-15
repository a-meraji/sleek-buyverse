import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export const EmptyCartState: FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Add some items to your cart to proceed with checkout.
          </p>
          <Button onClick={() => navigate('/products')} className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};