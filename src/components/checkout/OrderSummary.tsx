import { useCart } from "@/contexts/cart/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrderItem } from "./order/OrderItem";
import { OrderTotals } from "./order/OrderTotals";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function OrderSummary() {
  const { state: { items }, dispatch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            *,
            product_variants (*)
          )
        `);

      if (error) {
        console.error('Error fetching cart items:', error);
        return;
      }

      if (data) {
        console.log('Fetched cart items with variants:', data);
        dispatch({ type: 'SET_ITEMS', payload: data });
      }
    };

    fetchCartItems();
  }, [dispatch]);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const variant = item.product?.product_variants?.find(v => v.id === item.variant_id);
      const variantPrice = variant?.price ?? 0;
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
        {items.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>

      <OrderTotals
        subtotal={subtotal}
        tax={tax}
        shipping={shipping}
        total={total}
      />

      <Button 
        className="w-full" 
        size="lg"
        onClick={() => {
          console.log('Proceeding to checkout with total:', total);
        }}
      >
        Proceed to Payment (${total.toFixed(2)})
      </Button>
    </div>
  );
}