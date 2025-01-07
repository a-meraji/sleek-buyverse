import { useState, useEffect } from 'react';
import { CartItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthenticatedCart = (userId: string) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCartItems = async () => {
    if (!userId) return;
    
    try {
      console.log('Loading authenticated cart items for user:', userId);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            *,
            product_variants (*)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      console.log('Loaded authenticated cart items:', data);
      setCartItems(data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart items when userId changes
  useEffect(() => {
    if (userId) {
      loadCartItems();
    }
  }, [userId]);

  // Subscribe to real-time updates for cart items
  useEffect(() => {
    if (!userId) return;

    console.log('Setting up real-time subscription for cart items');
    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Received real-time cart update:', payload);
          loadCartItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      await loadCartItems();
      
      const event = new CustomEvent('cartUpdated', {
        detail: { openDrawer: false }
      });
      window.dispatchEvent(event);
      
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
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await loadCartItems();
      
      const event = new CustomEvent('cartUpdated', {
        detail: { openDrawer: false }
      });
      window.dispatchEvent(event);
      
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

  const refreshCart = async () => {
    console.log('Refreshing authenticated cart');
    await loadCartItems();
  };

  return {
    cartItems,
    isLoading,
    updateQuantity,
    removeItem,
    refreshCart
  };
};