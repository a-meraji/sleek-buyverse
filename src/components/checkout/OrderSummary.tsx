import { useEffect } from "react";
import { useCart } from "@/contexts/cart/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { OrderHeader } from "./order/OrderHeader";
import { OrderItemsList } from "./order/OrderItemsList";
import { OrderTotals } from "./order/OrderTotals";
import { useToast } from "@/hooks/use-toast";

export function OrderSummary() {
  const { state: { items }, addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCartItems = async () => {
      console.log('Fetching cart items for OrderSummary...');
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            *,
            product_variants (
              id,
              product_id,
              size,
              color,
              stock,
              price
            )
          )
        `);

      if (error) {
        console.error('Error fetching cart items:', error);
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        console.log('Fetched cart items:', data);
        data.forEach(item => {
          const cartItem = {
            id: item.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            product: item.product
          };
          addToCart(null, cartItem);
        });
      }
    };

    fetchCartItems();
  }, [addToCart, toast]);

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

  console.log('Rendering OrderSummary with items:', items);

  if (!items.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => window.history.back()}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <OrderHeader />
      
      <div className="bg-secondary/50 rounded-lg p-6 space-y-6">
        <OrderItemsList items={items} />
        
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
            toast({
              title: "Processing Order",
              description: "Redirecting to payment...",
            });
          }}
        >
          Proceed to Payment (${total.toFixed(2)})
        </Button>
      </div>
    </div>
  );
}