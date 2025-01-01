import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthChangeEvent, AuthError } from "@supabase/supabase-js";

interface SessionManagerProps {
  onError: (error: AuthError | null) => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ onError }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const transferLocalCartToServer = async (userId: string) => {
    try {
      console.log('Checking for local cart items to transfer...');
      const localCart = localStorage.getItem('cart');
      
      if (!localCart) {
        console.log('No local cart items found');
        return;
      }

      const localCartItems = JSON.parse(localCart);
      
      if (!Array.isArray(localCartItems) || localCartItems.length === 0) {
        console.log('Local cart is empty');
        return;
      }

      console.log('Found local cart items:', localCartItems);

      for (const item of localCartItems) {
        const variantId = item.product?.product_variants?.find(
          (v: any) => v.id === item.variant_id
        )?.id;

        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: item.product.id,
            quantity: item.quantity,
            variant_id: variantId
          });

        if (error) {
          console.error('Error transferring cart item:', error);
          throw error;
        }
      }

      console.log('Successfully transferred cart items to server');
      localStorage.removeItem('cart');
      
      toast({
        title: "Cart Synchronized",
        description: "Your cart items have been saved to your account.",
      });
    } catch (error) {
      console.error('Error during cart transfer:', error);
      toast({
        title: "Cart Sync Error",
        description: "Failed to sync your cart items. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        console.log("Initializing session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session initialization error:", error);
          if (mounted) onError(error);
          return;
        }

        if (session) {
          console.log("Initial session found:", session.user.id);
          if (mounted) {
            await transferLocalCartToServer(session.user.id);
          }
        } else {
          console.log("No initial session found");
        }
      } catch (err) {
        console.error("Unexpected error during session initialization:", err);
        if (mounted) onError(err as AuthError);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === "SIGNED_IN" && mounted) {
        console.log("User signed in:", session?.user?.id);
        if (session?.user) {
          await transferLocalCartToServer(session.user.id);
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }

      if (event === "SIGNED_OUT" && mounted) {
        console.log("User signed out");
        navigate("/auth");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, onError]);

  return null;
};