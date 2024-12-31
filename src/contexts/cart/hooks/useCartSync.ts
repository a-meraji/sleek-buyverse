import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from '../types';
import { useToast } from "@/hooks/use-toast";

export const useCartSync = (
  items: CartItem[],
  dispatch: React.Dispatch<any>
) => {
  const { toast } = useToast();

  useEffect(() => {
    const syncCart = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            // Fetch product details for local cart items
            const productIds = parsedCart.map((item: CartItem) => item.product_id);
            if (productIds.length > 0) {
              const { data: products } = await supabase
                .from('products')
                .select('*')
                .in('id', productIds);
              
              const cartWithProducts = parsedCart.map((item: CartItem) => ({
                ...item,
                product: products?.find(p => p.id === item.product_id)
              }));
              
              dispatch({ type: 'SET_ITEMS', payload: cartWithProducts });
            } else {
              dispatch({ type: 'SET_ITEMS', payload: parsedCart });
            }
          }
          return;
        }

        const { data: cartData, error } = await supabase
          .from('cart_items')
          .select(`
            *,
            product:products(*)
          `);

        if (error) throw error;
        dispatch({ type: 'SET_ITEMS', payload: cartData });
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

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
};