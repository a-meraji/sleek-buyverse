import { useState, useEffect } from 'react';
import { CartItem } from "@/contexts/cart/types";
import { useToast } from "@/hooks/use-toast";

export const useUnauthenticatedCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  // Load cart items on mount
  useEffect(() => {
    loadCartItems();
  }, []);

  const notifyCartUpdate = (updatedCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch both storage and custom events
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cart',
      newValue: JSON.stringify(updatedCart)
    }));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = storedCart.map((item: CartItem) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      notifyCartUpdate(updatedCart);
      setCartItems(updatedCart);
      
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
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const filteredCart = storedCart.filter((item: CartItem) => item.id !== itemId);
      
      notifyCartUpdate(filteredCart);
      setCartItems(filteredCart);
      
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

  const refreshCart = () => {
    loadCartItems();
  };

  return {
    cartItems,
    isLoading,
    updateQuantity,
    removeItem,
    refreshCart
  };
};