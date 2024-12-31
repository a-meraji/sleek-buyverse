import { useState, useEffect } from 'react';
import { CartItem } from "@/contexts/cart/types";
import { useToast } from "@/hooks/use-toast";

export const useUnauthenticatedCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load cart items from localStorage on mount
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        console.log('Loaded unauthenticated cart items:', parsedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, []);

  // Update localStorage whenever cart items change
  useEffect(() => {
    if (!isLoading) {
      console.log('Updating localStorage with cart items:', cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      console.log('Updating quantity for unauthenticated item:', itemId);
      setCartItems(prevItems => 
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );

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
      console.log('Removing unauthenticated item:', itemId);
      setCartItems(prevItems => 
        prevItems.filter(item => item.id !== itemId)
      );

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