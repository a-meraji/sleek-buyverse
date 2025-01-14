import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/cart/CartContext";
import { ProfileForm } from "@/components/navbar/ProfileForm";
import { CartContent } from "@/components/cart/CartContent";
import { CartSummary } from "@/components/cart/CartSummary";
import { Navbar } from "@/components/Navbar";

const Checkout = () => {
  const navigate = useNavigate();
  const { state: { items } } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold">Checkout</h1>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            <ProfileForm userId={userId} onClose={() => {}} />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="bg-secondary/50 rounded-lg p-6">
              <CartContent 
                cartItems={items} 
                userId={userId}
                updateQuantity={() => {}}
                removeItem={() => {}}
              />
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;