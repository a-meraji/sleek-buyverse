import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from '../types';

export const useCartOperations = () => {
  const { toast } = useToast();

  const addToCart = async (userId: string | null, item: Omit<CartItem, 'id'>) => {
    try {
      if (userId) {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            product_id: item.product_id,
            quantity: item.quantity,
            user_id: userId,
          })
          .select(`
            *,
            product:products(*)
          `)
          .single();

        if (error) throw error;
        return data;
      }
      
      // For unauthenticated users, return a local cart item
      return {
        ...item,
        id: `local-${Date.now()}`,
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateQuantity = async (userId: string | null, id: string, quantity: number) => {
    try {
      if (userId && !id.startsWith('local-')) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', id)
          .select(`
            *,
            product:products(*)
          `)
          .single();

        if (error) throw error;
        return data;
      }
      return { id, quantity };
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeItem = async (userId: string | null, id: string) => {
    try {
      if (userId && !id.startsWith('local-')) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }
      return id;
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    addToCart,
    updateQuantity,
    removeItem,
  };
};