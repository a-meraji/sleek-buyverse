import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCartSync = () => {
  const { toast } = useToast();

  const transferLocalCartToServer = async (userId: string) => {
    try {
      console.log('Checking for local cart items to transfer...');
      const localCart = localStorage.getItem('cart');
      
      if (!localCart) {
        console.log('No local cart items found');
        return;
      }

      const localCartItems = JSON.parse(localCart);
      
      if (!Array.isArray(localCartItems) || localCartItems.length === 0) {
        console.log('Local cart is empty');
        return;
      }

      console.log('Found local cart items:', localCartItems);

      for (const item of localCartItems) {
        const variantId = item.product?.product_variants?.find(
          (v: any) => v.id === item.variant_id
        )?.id;

        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: item.product.id,
            quantity: item.quantity,
            variant_id: variantId
          });

        if (error) {
          console.error('Error transferring cart item:', error);
          throw error;
        }
      }

      console.log('Successfully transferred cart items to server');
      localStorage.removeItem('cart');
      
      toast({
        title: "Cart Synchronized",
        description: "Your cart items have been saved to your account.",
      });
    } catch (error) {
      console.error('Error during cart transfer:', error);
      toast({
        title: "Cart Sync Error",
        description: "Failed to sync your cart items. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return { transferLocalCartToServer };
};