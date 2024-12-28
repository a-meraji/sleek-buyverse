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