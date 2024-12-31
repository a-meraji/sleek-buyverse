import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from '../types';
import { useCallback } from 'react';

export const useCartOperations = () => {
  const { toast } = useToast();

  const handleAuthenticatedCart = async (
    userId: string,
    operation: 'add' | 'update' | 'remove',
    data: any
  ) => {
    switch (operation) {
      case 'add':
        const { data: insertData, error: insertError } = await supabase
          .from('cart_items')
          .insert({
            product_id: data.product_id,
            quantity: data.quantity,
            user_id: userId,
          })
          .select(`
            *,
            product:products(*)
          `)
          .single();

        if (insertError) throw insertError;
        return insertData;

      case 'update':
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: data.quantity })
          .eq('id', data.id);

        if (updateError) throw updateError;
        break;

      case 'remove':
        const { error: deleteError } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', data.id);

        if (deleteError) throw deleteError;
        break;
    }
  };

  const handleUnauthenticatedCart = async (
    operation: 'add' | 'update' | 'remove',
    data: any
  ) => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

    switch (operation) {
      case 'add': {
        const { data: product } = await supabase
          .from('products')
          .select('*')
          .eq('id', data.product_id)
          .single();

        const newItem = {
          ...data,
          id: `local-${Date.now()}`,
          product
        };
        
        localCart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(localCart));
        return newItem;
      }

      case 'update': {
        const updatedCart = localCart.map((item: CartItem) =>
          item.id === data.id ? { ...item, quantity: data.quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        break;
      }

      case 'remove': {
        const filteredCart = localCart.filter((item: CartItem) => item.id !== data.id);
        localStorage.setItem('cart', JSON.stringify(filteredCart));
        break;
      }
    }
  };

  const addToCart = async (userId: string | null, item: Omit<CartItem, 'id'>) => {
    try {
      console.log('Adding to cart for user:', userId);
      
      if (userId) {
        return await handleAuthenticatedCart(userId, 'add', item);
      } else {
        return await handleUnauthenticatedCart('add', item);
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
        await handleAuthenticatedCart(userId, 'update', { id, quantity });
      } else {
        await handleUnauthenticatedCart('update', { id, quantity });
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
        await handleAuthenticatedCart(userId, 'remove', { id });
      } else {
        await handleUnauthenticatedCart('remove', { id });
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