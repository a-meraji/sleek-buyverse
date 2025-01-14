import { useCart } from "@/contexts/cart/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { OrderSummaryContent } from "./order/OrderSummaryContent";

export function OrderSummary() {
  const { state: { items, isLoading } } = useCart();
  const { toast } = useToast();

  console.log('OrderSummary state:', {
    isLoading,
    itemsCount: items.length,
    cartItems: items
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading cart items...</div>;
  }

  if (!items.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => window.history.back()}>Continue Shopping</Button>
      </div>
    );
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      if (!item.variant?.price) return total;
      
      const variantPrice = item.variant.price;
      const discount = item.product?.discount;
      const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
      const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = subtotal + tax + shipping;

  return <OrderSummaryContent 
    items={items}
    subtotal={subtotal}
    tax={tax}
    shipping={shipping}
    total={total}
  />;
}