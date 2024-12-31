import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartState, CartAction, CartContextType, CartItem } from './types';
import { cartReducer } from './cartReducer';
import { mergeCartItems } from './utils';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
  });

  // Load cart items from local storage on mount
  useEffect(() => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      dispatch({ type: 'SET_ITEMS', payload: JSON.parse(localCart) });
    }
  }, []);

  // Save cart items to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Cart auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('Clearing cart on sign out');
        dispatch({ type: 'SET_ITEMS', payload: [] });
        localStorage.removeItem('cart');
      }

      if (event === 'SIGNED_IN') {
        console.log('Merging local cart with server cart');
        const localItems = state.items;
        
        try {
          // Get server cart items
          const { data: serverItems, error } = await supabase
            .from('cart_items')
            .select(`
              *,
              product:products(*)
            `)
            .eq('user_id', session?.user.id);

          if (error) throw error;

          // Merge local and server items
          if (localItems.length > 0) {
            console.log('Merging local items:', localItems);
            const mergedItems = mergeCartItems(localItems, serverItems || []);
            
            // Update server with merged items
            for (const item of mergedItems) {
              if (!item.id.toString().startsWith('local-')) continue;
              
              await supabase
                .from('cart_items')
                .insert({
                  product_id: item.product_id,
                  quantity: item.quantity,
                  user_id: session?.user.id,
                });
            }
          }

          // Load final server cart
          const { data: finalCart } = await supabase
            .from('cart_items')
            .select(`
              *,
              product:products(*)
            `)
            .eq('user_id', session?.user.id);

          dispatch({ type: 'SET_ITEMS', payload: finalCart || [] });
          localStorage.removeItem('cart');
        } catch (error) {
          console.error('Error merging carts:', error);
          toast({
            title: "Error",
            description: "Failed to sync your cart",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [state.items, toast]);

  const loadCartItems = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          dispatch({ type: 'SET_ITEMS', payload: JSON.parse(localCart) });
        }
        return;
      }

      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `);

      if (cartError) {
        console.error('Error fetching cart:', cartError);
        throw cartError;
      }

      dispatch({ type: 'SET_ITEMS', payload: cartData });
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        // Handle unauthenticated user
        const newItem = {
          ...item,
          id: `local-${Date.now()}`,
        };
        dispatch({ type: 'ADD_ITEM', payload: newItem });
        toast({
          title: "Added to cart",
          description: "Item has been added to your local cart",
        });
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          product_id: item.product_id,
          quantity: item.quantity,
          user_id: session.session.user.id,
        })
        .select(`
          *,
          product:products(*)
        `)
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_ITEM', payload: data });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        // Handle unauthenticated user
        dispatch({
          type: 'UPDATE_ITEM',
          payload: {
            ...state.items.find(item => item.id === id)!,
            quantity,
          },
        });
        return;
      }

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

      dispatch({ type: 'UPDATE_ITEM', payload: data });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        // Handle unauthenticated user
        dispatch({ type: 'REMOVE_ITEM', payload: id });
        toast({
          title: "Item removed",
          description: "Item has been removed from your local cart",
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'REMOVE_ITEM', payload: id });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
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

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeItem,
        loadCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
