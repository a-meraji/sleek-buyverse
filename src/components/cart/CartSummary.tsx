import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";

interface CartSummaryProps {
  total: number;
  isAuthenticated: boolean;
  itemsExist: boolean;
  onClose: () => void;
}

export const CartSummary = ({ total, isAuthenticated, itemsExist, onClose }: CartSummaryProps) => {
  const navigate = useNavigate();
  const { subtotal, tax, shipping } = useOrderCalculations();
  console.log('Rendering cart summary with total:', total);
  
  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };
  
  return (
    <div className="bg-secondary p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex justify-between py-4 border-t">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">${total.toFixed(2)}</span>
      </div>
      
      <Button 
        className="w-full" 
        size="lg"
        disabled={!itemsExist}
        onClick={handleCheckout}
      >
        {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
      </Button>
    </div>
  );
};