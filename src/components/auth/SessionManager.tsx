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

      // Transfer each item to the server
      for (const item of localCartItems) {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: item.product.id,
            quantity: item.quantity
          });

        if (error) {
          console.error('Error transferring cart item:', error);
          throw error;
        }
      }

      console.log('Successfully transferred cart items to server');
      
      // Clear local cart after successful transfer
      localStorage.removeItem('cart');
      console.log('Cleared local cart storage');

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
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          onError(error);
          return;
        }

        if (session) {
          console.log("User already logged in:", session.user);
          await transferLocalCartToServer(session.user.id);
          navigate("/");
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        onError(err as AuthError);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user);
        if (session?.user) {
          await transferLocalCartToServer(session.user.id);
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }

      if (event === "USER_UPDATED") {
        console.log("User profile updated");
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }

      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery requested");
        toast({
          title: "Password Recovery",
          description: "Check your email for password reset instructions.",
        });
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        navigate("/auth");
      }

      // Handle authentication errors
      if (event === "TOKEN_REFRESHED" && !session) {
        const error = session as unknown as AuthError;
        if (error?.message) {
          console.error("Token refresh error:", error);
          onError(error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, onError]);

  return null;
};