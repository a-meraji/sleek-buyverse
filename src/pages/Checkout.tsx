import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/cart/CartContext";
import { ProfileForm } from "@/components/navbar/ProfileForm";
import { CartContent } from "@/components/cart/CartContent";
import { CartSummary } from "@/components/cart/CartSummary";
import { Navbar } from "@/components/Navbar";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import { Separator } from "@/components/ui/separator";

const Checkout = () => {
  const navigate = useNavigate();
  const { state: { items } } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { total } = useOrderCalculations();

  console.log('Checkout page - Cart items:', items);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">Add some items to your cart to proceed with checkout.</p>
            <Button onClick={() => navigate('/products')} className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8" id="checkout-title">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column - Forms */}
            <div className="lg:col-span-7 space-y-8">
              <section aria-labelledby="shipping-heading" className="bg-card rounded-lg p-6 shadow-sm">
                <h2 id="shipping-heading" className="text-xl font-semibold mb-6">
                  Shipping Information
                </h2>
                <ProfileForm userId={userId} onClose={() => {}} />
              </section>
            </div>

            {/* Right column - Order summary */}
            <div className="lg:col-span-5 space-y-6">
              <section aria-labelledby="order-heading" className="bg-card rounded-lg shadow-sm divide-y">
                <h2 id="order-heading" className="sr-only">Order summary</h2>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                  <CartContent 
                    cartItems={items} 
                    userId={userId}
                    updateQuantity={() => {}}
                    removeItem={() => {}}
                    readonly={true}
                  />
                </div>

                <div className="p-6">
                  <CartSummary 
                    total={total}
                    isAuthenticated={!!userId}
                    itemsExist={items.length > 0}
                    onClose={() => {}}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;