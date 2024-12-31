import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  total: number;
  isAuthenticated: boolean;
  itemsExist: boolean;
}

export const CartSummary = ({ total, isAuthenticated, itemsExist }: CartSummaryProps) => {
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
        onClick={() => {
          if (!isAuthenticated) {
            window.location.href = '/auth';
          }
        }}
      >
        {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
      </Button>
    </div>
  );
};