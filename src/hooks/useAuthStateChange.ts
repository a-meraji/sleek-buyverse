import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";

export const useAuthStateChange = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("SessionManager: Auth state changed:", {
        event,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      if (event === "SIGNED_IN" && mounted) {
        console.log("SessionManager: User signed in:", session?.user?.id);
        if (session?.user) {
          localStorage.setItem('supabase.auth.token', session.access_token);
          localStorage.setItem('supabase.auth.user', JSON.stringify(session.user));
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
        localStorage.removeItem('supabase.auth.user');
        navigate("/auth");
      }

      if (event === "TOKEN_REFRESHED" && mounted) {
        console.log("SessionManager: Token refreshed");
        if (session?.access_token) {
          localStorage.setItem('supabase.auth.token', session.access_token);
          if (session.user) {
            localStorage.setItem('supabase.auth.user', JSON.stringify(session.user));
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
};