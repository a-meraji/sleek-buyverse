import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  total: number;
  isAuthenticated: boolean;
  itemsExist: boolean;
  onClose: () => void;
}

export const CartSummary = ({ total, isAuthenticated, itemsExist, onClose }: CartSummaryProps) => {
  const navigate = useNavigate();
  const { subtotal, tax, shipping } = useOrderCalculations();
  
  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>

        <Separator className="my-4" />
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        className="w-full py-6 text-lg"
        size="lg"
        disabled={!itemsExist}
        onClick={handleCheckout}
        aria-label={isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
      >
        {isAuthenticated ? 'Place Order' : 'Sign in to Checkout'}
      </Button>

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground text-center">
          You need to sign in to complete your purchase
        </p>
      )}
    </div>
  );
};