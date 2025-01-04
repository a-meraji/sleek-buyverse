import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";

export const useSessionInit = (onError: (error: AuthError | null) => void) => {
  const { toast } = useToast();

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
            localStorage.setItem('supabase.auth.token', session.access_token);
            localStorage.setItem('supabase.auth.user', JSON.stringify(session.user));
          }
        } else {
          console.log("SessionManager: No active session found");
          if (mounted) {
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('supabase.auth.user');
          }
        }
      } catch (err) {
        console.error("SessionManager: Unexpected error during initialization:", err);
        if (mounted) onError(err as AuthError);
      }
    };

    initializeSession();

    return () => {
      mounted = false;
    };
  }, [onError, toast]);
};