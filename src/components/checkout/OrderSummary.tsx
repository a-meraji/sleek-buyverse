import { useEffect } from "react";
import { useCart } from "@/contexts/cart/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrderSummaryContent } from "./order/OrderSummaryContent";

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
            product_variants (*)
          ),
          variant:product_variants (*)
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
            product: item.product,
            variant: item.variant
          };
          addToCart(null, cartItem);
        });
      }
    };

    fetchCartItems();
  }, [addToCart, toast]);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const variant = item.variant || item.product?.product_variants?.find(v => v.id === item.variant_id);
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

  return <OrderSummaryContent 
    items={items}
    subtotal={subtotal}
    tax={tax}
    shipping={shipping}
    total={total}
  />;
}