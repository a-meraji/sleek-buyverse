import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from '../types';

export const useAuthenticatedCart = () => {
  const { toast } = useToast();

  const addToAuthenticatedCart = async (userId: string, data: Partial<CartItem>) => {
    console.log('Adding to authenticated cart:', { userId, data });
    
    try {
      // Insert new item directly without checking for existing items
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