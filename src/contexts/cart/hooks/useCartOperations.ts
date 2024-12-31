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
    console.log(`Handling ${operation} operation for authenticated user:`, { userId, data });
    
    switch (operation) {
      case 'add': {
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
      }

      case 'update': {
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: data.quantity })
          .eq('id', data.id);

        if (updateError) throw updateError;
        console.log('Updated server cart item quantity:', data.id, data.quantity);
        break;
      }

      case 'remove': {
        const { error: deleteError } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', data.id);

        if (deleteError) throw deleteError;
        console.log('Removed item from server cart:', data.id);
        break;
      }
    }
  };

  const handleUnauthenticatedCart = async (
    operation: 'add' | 'update' | 'remove',
    data: any
  ) => {
    console.log(`Handling ${operation} operation for unauthenticated user`, data);
    
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

    switch (operation) {
      case 'add': {
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
        
        localCart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.log('Added item to local cart:', newItem);
        return newItem;
      }

      case 'update': {
        const updatedCart = localCart.map((item: CartItem) =>
          item.id === data.id ? { ...item, quantity: data.quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log('Updated local cart item quantity:', data.id, data.quantity);
        break;
      }

      case 'remove': {
        const filteredCart = localCart.filter((item: CartItem) => item.id !== data.id);
        localStorage.setItem('cart', JSON.stringify(filteredCart));
        console.log('Removed item from local cart:', data.id);
        break;
      }
    }
  };

  const addToCart = async (userId: string | null, item: Omit<CartItem, 'id'>) => {
    try {
      console.log('Adding to cart:', { userId, item });
      
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
      console.log('Updating quantity:', { userId, id, quantity });
      
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
      console.log('Removing item:', { userId, id });
      
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