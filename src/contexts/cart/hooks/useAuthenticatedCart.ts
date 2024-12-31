import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from '../types';

export const useAuthenticatedCart = () => {
  const { toast } = useToast();

  const addToAuthenticatedCart = async (userId: string, data: Partial<CartItem>) => {
    console.log('Adding to authenticated cart:', { userId, data });
    
    try {
      // First check if the item exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', data.product_id)
        .eq('variant_id', data.variant_id)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const { data: updatedItem, error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
          .select(`
            *,
            product:products(
              *,
              product_variants(*)
            )
          `)
          .single();

        if (updateError) throw updateError;
        return updatedItem;
      } else {
        // Insert new item if it doesn't exist
        const { data: insertData, error: insertError } = await supabase
          .from('cart_items')
          .insert({
            product_id: data.product_id,
            variant_id: data.variant_id,
            quantity: data.quantity,
            user_id: userId,
          })
          .select(`
            *,
            product:products(
              *,
              product_variants(*)
            )
          `)
          .single();

        if (insertError) throw insertError;
        return insertData;
      }
    } catch (error) {
      console.error('Error in authenticated cart operation:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { addToAuthenticatedCart };
};