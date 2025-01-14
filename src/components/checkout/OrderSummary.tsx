import { useEffect, useState } from "react";
import { useCart } from "@/contexts/cart/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types";
import { OrderSummaryContent } from "./order/OrderSummaryContent";

export function OrderSummary() {
  const { state: { items }, addToCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      console.log('Fetching cart items for OrderSummary...');
      setIsLoading(true);
      
      try {
        const { data: cartData, error: cartError } = await supabase
          .from('cart_items')
          .select(`
            *,
            product:products(*),
            variant:product_variants!cart_items_variant_id_fkey(*)
          `);

        if (cartError) {
          console.error('Error fetching cart items:', cartError);
          toast({
            title: "Error",
            description: "Failed to load cart items",
            variant: "destructive",
          });
          return;
        }

        if (cartData) {
          console.log('Raw cart data:', cartData);
          
          const processedItems = cartData.map(item => ({
            ...item,
            product: item.product,
            variant: item.variant
          })).filter(item => item.product && item.variant);

          console.log('Processed cart items:', processedItems);
          setCartItems(processedItems);
          
          // Update cart context with processed items
          processedItems.forEach(item => {
            if (item.product && item.variant) {
              addToCart(null, item);
            }
          });
        }
      } catch (error) {
        console.error('Error in fetchCartItems:', error);
        toast({
          title: "Error",
          description: "Something went wrong while loading your cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [addToCart, toast]);

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

  console.log('OrderSummary state:', {
    isLoading,
    itemsCount: items.length,
    cartItems: items,
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