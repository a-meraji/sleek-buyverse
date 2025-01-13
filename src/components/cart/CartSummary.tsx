import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  total: number;
  isAuthenticated: boolean;
  itemsExist: boolean;
  onClose: () => void;
}

export const CartSummary = ({ total, isAuthenticated, itemsExist, onClose }: CartSummaryProps) => {
  const navigate = useNavigate();
  console.log('Rendering cart summary with total:', total);
  
  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate('/auth');
    }
    // Handle checkout logic here
  };
  
  return (
    <div className="bg-secondary p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      <div className="flex justify-between py-4 border-t">
        <span>Total</span>
        <span className="font-medium">${total.toFixed(2)}</span>
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