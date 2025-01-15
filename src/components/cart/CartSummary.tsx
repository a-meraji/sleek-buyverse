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
}

export const CartSummary = ({ isAuthenticated, itemsExist, onClose, cartItems }: CartSummaryProps) => {
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
  const total = subtotal + tax + shipping;
  
  console.log('Cart summary calculations:', {
    subtotal,
    tax,
    shipping,
    total,
    itemsCount: cartItems?.length
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