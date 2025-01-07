import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Drawer } from "vaul";

interface CartSummaryProps {
  total: number;
  isAuthenticated: boolean;
  itemsExist: boolean;
}

export const CartSummary = ({ total, isAuthenticated, itemsExist }: CartSummaryProps) => {
  const navigate = useNavigate();
  console.log('Rendering cart summary with total:', total);
  
  return (
    <div className="bg-secondary p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      <div className="flex justify-between py-4 border-t">
        <span>Total</span>
        <span className="font-medium">${total.toFixed(2)}</span>
      </div>
      
      <Drawer.Close asChild>
        <Button 
          className="w-full" 
          size="lg"
          disabled={!itemsExist}
          onClick={() => {
            if (!isAuthenticated) {
              navigate('/auth');
            }
          }}
        >
          {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
        </Button>
      </Drawer.Close>
    </div>
  );
};