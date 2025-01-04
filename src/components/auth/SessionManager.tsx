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
        console.log("SessionManager: Starting session initialization...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("SessionManager: Session initialization error:", error);
          if (mounted) onError(error);
          return;
        }

        if (session?.user) {
          console.log("SessionManager: Initial session found:", {
            userId: session.user.id,
            email: session.user.email,
            timestamp: new Date().toISOString()
          });
          
          if (mounted) {
            await transferLocalCartToServer(session.user.id);
            // Persist session in localStorage
            localStorage.setItem('supabase.auth.token', session.access_token);
          }
        } else {
          console.log("SessionManager: No active session found");
          if (mounted) {
            // Clear any stale session data
            localStorage.removeItem('supabase.auth.token');
            navigate('/auth');
          }
        }
      } catch (err) {
        console.error("SessionManager: Unexpected error during initialization:", err);
        if (mounted) onError(err as AuthError);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("SessionManager: Auth state changed:", {
        event,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      if (event === "SIGNED_IN" && mounted) {
        console.log("SessionManager: User signed in:", session?.user?.id);
        if (session?.user) {
          await transferLocalCartToServer(session.user.id);
          localStorage.setItem('supabase.auth.token', session.access_token);
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }

      if (event === "SIGNED_OUT" && mounted) {
        console.log("SessionManager: User signed out");
        localStorage.removeItem('supabase.auth.token');
        navigate("/auth");
      }

      // Handle token refresh
      if (event === "TOKEN_REFRESHED" && mounted) {
        console.log("SessionManager: Token refreshed");
        if (session?.access_token) {
          localStorage.setItem('supabase.auth.token', session.access_token);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, onError]);

  return null;
};