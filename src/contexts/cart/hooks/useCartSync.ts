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
        
        // Handle unauthenticated users
        if (!session.session) {
          console.log('Syncing local cart for unauthenticated user');
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
              console.log('Local cart synced with products:', cartWithProducts);
            } else {
              dispatch({ type: 'SET_ITEMS', payload: parsedCart });
            }
          }
          return;
        }

        // Handle authenticated users
        console.log('Syncing cart for authenticated user:', session.session.user.id);
        const { data: cartData, error } = await supabase
          .from('cart_items')
          .select(`
            *,
            product:products(*)
          `);

        if (error) throw error;
        dispatch({ type: 'SET_ITEMS', payload: cartData });
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

  // Save to localStorage whenever items change
  useEffect(() => {
    console.log('Saving cart to localStorage:', items);
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
};