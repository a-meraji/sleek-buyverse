import { useEffect, useState } from "react";
import { useCart } from "@/contexts/cart/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrderSummaryContent } from "./order/OrderSummaryContent";
import { CartItem } from "@/types";

export function OrderSummary() {
  const { state: { items }, addToCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      console.log('Fetching cart items for OrderSummary...');
      setIsLoading(true);
      
      // Match the cart's data fetching pattern
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (*),
          variant:product_variants (*)
        `);

      if (error) {
        console.error('Error fetching cart items:', error);
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data) {
        console.log('Fetched cart items:', data);
        // Process items similar to cart component
        const processedItems = data.map(item => ({
          id: item.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          product: item.product,
          variant: item.variant
        }));
        
        setCartItems(processedItems);
        // Clear existing items before adding new ones
        processedItems.forEach(item => {
          addToCart(null, item);
        });
        
        console.log('Processed cart items:', processedItems);
      }
      setIsLoading(false);
    };

    fetchCartItems();
  }, [addToCart, toast]);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      // Match cart's price calculation
      const variant = item.variant;
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

  console.log('Rendering OrderSummary with:', {
    isLoading,
    items,
    cartItems,
    subtotal,
    total
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

  return <OrderSummaryContent 
    items={items}
    subtotal={subtotal}
    tax={tax}
    shipping={shipping}
    total={total}
  />;
}