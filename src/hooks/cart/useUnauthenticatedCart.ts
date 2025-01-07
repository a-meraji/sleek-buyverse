import { useState, useEffect } from 'react';
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useUnauthenticatedCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCartItems = () => {
    try {
      console.log('Loading unauthenticated cart items');
      const storedCart = localStorage.getItem('cart');
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];
      console.log('Loaded unauthenticated cart items:', parsedCart);
      setCartItems(parsedCart);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    }
    setIsLoading(false);
  };

  // Load cart items on mount
  useEffect(() => {
    loadCartItems();
  }, []);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        console.log('Cart storage changed in another tab, reloading cart items');
        loadCartItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateLocalStorageAndState = (updatedCart: CartItem[], openDrawer: boolean = false) => {
    console.log('Updating cart in localStorage and state:', updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update state immediately
    setCartItems(updatedCart);
    
    // Dispatch event after state is updated
    const event = new CustomEvent('cartUpdated', {
      detail: { 
        openDrawer,
        cartItems: updatedCart 
      }
    });
    window.dispatchEvent(event);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = currentCart.map((item: CartItem) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      updateLocalStorageAndState(updatedCart);
      
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
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = currentCart.filter((item: CartItem) => item.id !== itemId);
      updateLocalStorageAndState(updatedCart);
      
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
    console.log('Refreshing unauthenticated cart');
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