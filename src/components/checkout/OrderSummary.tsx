import { useCart } from "@/contexts/cart/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OrderSummary() {
  const { state: { items } } = useCart();
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const variant = item.product?.product_variants?.find(v => v.id === item.variant_id);
      const price = variant?.price ?? 0;
      const quantity = item.quantity;
      return total + (price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = subtotal + tax + shipping;

  console.log('Rendering OrderSummary with items:', items);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const variant = item.product?.product_variants?.find(v => v.id === item.variant_id);
          const price = variant?.price ?? 0;
          const subtotal = price * item.quantity;
          
          return (
            <div key={item.id} className="flex justify-between p-4 bg-secondary rounded-lg">
              <div>
                <h3 className="font-medium">{item.product?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Size: {variant?.size}, Color: {variant?.color}
                </p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p>${price.toFixed(2)} × {item.quantity}</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-secondary p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button 
        className="w-full" 
        size="lg"
        onClick={() => {
          // Here you would implement the checkout logic
          console.log('Proceeding to checkout with total:', total);
        }}
      >
        Proceed to Payment (${total.toFixed(2)})
      </Button>
    </div>
  );
}