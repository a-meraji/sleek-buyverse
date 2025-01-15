import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { LoadingState } from "@/components/checkout/LoadingState";
import { EmptyCartState } from "@/components/checkout/EmptyCartState";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedCart } from "@/hooks/cart/useAuthenticatedCart";
import { useUnauthenticatedCart } from "@/hooks/cart/useUnauthenticatedCart";

const Checkout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const authenticatedCart = useAuthenticatedCart(session?.user?.id || '');
  const unauthenticatedCart = useUnauthenticatedCart();

  const {
    cartItems,
  } = session?.user?.id ? authenticatedCart : unauthenticatedCart;

  console.log('Checkout page - Cart items:', cartItems);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!cartItems || cartItems.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <CheckoutHeader />
          <CheckoutContent />
        </div>
      </main>
    </div>
  );
};

export default Checkout;