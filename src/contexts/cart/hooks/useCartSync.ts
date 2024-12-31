import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from '../types';
import { useToast } from "@/hooks/use-toast";

export const useCartSync = (
  items: CartItem[],
  dispatch: React.Dispatch<any>
) => {
  const { toast } = useToast();

  // Sync cart data from the appropriate source (Supabase or localStorage)
  useEffect(() => {
    const syncCart = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Syncing cart for session:', sessionData.session);
        
        if (!sessionData.session) {
          // Handle unauthenticated users - sync from localStorage
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            dispatch({ type: 'SET_ITEMS', payload: parsedCart });
            console.log('Local cart synced:', parsedCart);
          } else {
            dispatch({ type: 'SET_ITEMS', payload: [] });
          }
          return;
        }

        // Handle authenticated users - sync from Supabase
        const { data: cartData, error } = await supabase
          .from('cart_items')
          .select(`
            *,
            product:products(*)
          `);

        if (error) throw error;
        dispatch({ type: 'SET_ITEMS', payload: cartData || [] });
        console.log('Server cart synced:', cartData);
      } catch (error) {
        console.error('Error syncing cart:', error);
        toast({
          title: "Error",
          description: "Failed to sync cart",
          variant: "destructive",
        });
      }
    };

    syncCart();
  }, [dispatch, toast]);

  // Keep localStorage in sync for unauthenticated users
  useEffect(() => {
    const syncLocalStorage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const localItems = items.filter(item => item.id.startsWith('local-'));
        localStorage.setItem('cart', JSON.stringify(localItems));
        console.log('Updated localStorage cart:', localItems);
      }
    };

    syncLocalStorage();
  }, [items]);
};