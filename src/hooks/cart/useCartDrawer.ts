import { useState, useCallback, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthenticatedCart } from "./useAuthenticatedCart";
import { useUnauthenticatedCart } from "./useUnauthenticatedCart";

export const useCartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 0,
    gcTime: 0
  });

  const authenticatedCart = useAuthenticatedCart(session?.user?.id || '');
  const unauthenticatedCart = useUnauthenticatedCart();

  const {
    cartItems,
    isLoading,
    updateQuantity,
    removeItem,
    refreshCart
  } = session?.user?.id ? authenticatedCart : unauthenticatedCart;

  const handleCartUpdate = useCallback((event: CustomEvent) => {
    console.log('Cart update event received in CartDrawer:', event.detail);
    refreshCart();
    if (event.detail?.openDrawer) {
      setIsOpen(true);
    }
  }, [refreshCart]);

  useEffect(() => {
    console.log('Setting up cart update listener with auth status:', !!session?.user?.id);
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, [handleCartUpdate]);

  const total = cartItems?.reduce((sum, item) => {
    const variantPrice = item.product?.product_variants?.find(v => v.id === item.variant_id)?.price ?? 0;
    const discount = item.product?.discount;
    const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
    const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
    return sum + (discountedPrice * item.quantity);
  }, 0) ?? 0;

  return {
    isOpen,
    setIsOpen,
    session,
    cartItems,
    isLoading: isSessionLoading || isLoading,
    updateQuantity,
    removeItem,
    total
  };
};