import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/cart/types";
import { useToast } from "@/hooks/use-toast";

export const useAuthenticatedCart = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      console.log('Fetching authenticated cart items for user:', userId);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      console.log('Fetched cart items:', data);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0 // Don't cache the results
  });

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      console.log('Updating quantity for authenticated item:', itemId);
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      // Immediately update the cache and trigger a refetch
      await queryClient.invalidateQueries({ queryKey: ['cart', userId] });

      toast({
        title: "Cart updated",
        description: "Item quantity has been updated",
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      console.log('Removing authenticated item:', itemId);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Immediately update the cache and trigger a refetch
      await queryClient.invalidateQueries({ queryKey: ['cart', userId] });

      toast({
        title: "Item removed",
        description: "Item has been removed from cart",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  return {
    cartItems,
    isLoading,
    updateQuantity,
    removeItem,
  };
};