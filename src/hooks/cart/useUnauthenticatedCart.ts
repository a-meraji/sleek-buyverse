import { useState, useEffect } from 'react';
import { CartItem } from "@/types";
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('Cart update event received in useUnauthenticatedCart');
      loadCartItems();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const notifyCartUpdate = (updatedCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
    console.log('Cart updated and event dispatched:', updatedCart);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updatedCart = cartItems.map(item =>
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
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      notifyCartUpdate(updatedCart);
      setCartItems(updatedCart);
      
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