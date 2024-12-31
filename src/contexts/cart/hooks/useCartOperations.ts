import { useToast } from "@/hooks/use-toast";
import { CartItem } from '../types';
import { useAuthenticatedCart } from './useAuthenticatedCart';
import { useUnauthenticatedCartOperations } from './useUnauthenticatedCartOperations';
import { supabase } from "@/integrations/supabase/client";

export const useCartOperations = () => {
  const { toast } = useToast();
  const { addToAuthenticatedCart } = useAuthenticatedCart();
  const { addToUnauthenticatedCart } = useUnauthenticatedCartOperations();

  const addToCart = async (userId: string | null, item: Omit<CartItem, 'id'>) => {
    try {
      console.log('Adding to cart:', { userId, item });
      
      if (userId) {
        return await addToAuthenticatedCart(userId, item);
      } else {
        return await addToUnauthenticatedCart(item);
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
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', id);

        if (error) throw error;
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.map((item: CartItem) =>
          item.id === id ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
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
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const filteredCart = localCart.filter((item: CartItem) => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(filteredCart));
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