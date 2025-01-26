import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types";

interface CartSummaryProps {
  total: number;
  isAuthenticated: boolean;
  itemsExist: boolean;
  onClose: () => void;
  cartItems: CartItem[] | null;
  readonly?: boolean;
}

export const CartSummary = ({ 
  isAuthenticated, 
  itemsExist, 
  onClose, 
  cartItems,
  readonly = false 
}: CartSummaryProps) => {
  const navigate = useNavigate();
  
  // Calculate subtotal from cart items
  const subtotal = cartItems?.reduce((sum, item) => {
    const variantPrice = item.product?.product_variants?.find(v => v.id === item.variant_id)?.price ?? 0;
    const discount = item.product?.discount;
    const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
    const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
    return sum + (discountedPrice * item.quantity);
  }, 0) ?? 0;

  // Calculate tax and shipping
  const TAX_RATE = 0.08; // 8% tax rate
  const SHIPPING_RATE = cartItems?.length ? 5.99 : 0; // Flat shipping rate if items exist
  const tax = subtotal * TAX_RATE;
  const shipping = SHIPPING_RATE;
  const total = readonly ? subtotal : (subtotal + tax + shipping);
  
  console.log('Cart summary calculations:', {
    subtotal,
    tax,
    shipping,
    total,
    itemsCount: cartItems?.length,
    mode: readonly ? 'readonly' : 'full'
  });
  
  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="space-y-4">
        {!readonly && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">${shipping.toFixed(2)}</span>
            </div>

            <Separator className="my-4" />
          </>
        )}
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        className="w-full py-6 text-lg bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        size="lg"
        disabled={!itemsExist}
        onClick={handleCheckout}
        aria-label={isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
      >
        {isAuthenticated ? 'Place Order' : 'Sign in to Checkout'}
      </Button>

      {!isAuthenticated && (
        <p className="text-sm text-gray-500 text-center">
          You need to sign in to complete your purchase
        </p>
      )}
    </div>
  );
};