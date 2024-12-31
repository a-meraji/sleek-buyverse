import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from '../types';
import { useCallback } from 'react';

export const useCartOperations = () => {
  const { toast } = useToast();

  const addToCart = async (userId: string | null, item: Omit<CartItem, 'id'>) => {
    try {
      console.log('Adding to cart for user:', userId);
      
      if (userId) {
        // For authenticated users, add to Supabase
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
        console.log('Added item to Supabase cart:', data);
        return data;
      } else {
        // For unauthenticated users, add to localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const newItem = {
          ...item,
          id: `local-${Date.now()}`,
        };
        
        // Fetch product details
        const { data: product } = await supabase
          .from('products')
          .select('*')
          .eq('id', item.product_id)
          .single();
        
        newItem.product = product;
        
        localCart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.log('Added item to local cart:', newItem);
        return newItem;
      }
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
      console.log('Updating quantity for item:', id, 'user:', userId);
      
      if (userId && !id.startsWith('local-')) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Update localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.map((item: CartItem) =>
          item.id === id ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log('Updated local cart item quantity:', id, quantity);
      }
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
      console.log('Removing item:', id, 'for user:', userId);
      
      if (userId && !id.startsWith('local-')) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        // Remove from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.filter((item: CartItem) => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log('Removed item from local cart:', id);
      }
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