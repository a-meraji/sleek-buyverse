import { useToast } from "@/hooks/use-toast";
import { CartItem } from '../types';
import { supabase } from "@/integrations/supabase/client";

export const useUnauthenticatedCartOperations = () => {
  const { toast } = useToast();

  const addToUnauthenticatedCart = async (data: Partial<CartItem>) => {
    console.log('Adding to unauthenticated cart:', data);
    
    try {
      // Fetch product details
      const { data: product } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', data.product_id)
        .single();

      const newItem = {
        ...data,
        id: `local-${Date.now()}`,
        product
      };
      
      // Get existing cart
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      localCart.push(newItem);
      localStorage.setItem('cart', JSON.stringify(localCart));
      
      console.log('Added item to local cart:', newItem);
      return newItem;
    } catch (error) {
      console.error('Error in unauthenticated cart operation:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { addToUnauthenticatedCart };
};