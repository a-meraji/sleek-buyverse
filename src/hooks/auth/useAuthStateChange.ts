import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuthStateChange = (
  updateAuthState: (user: User | null, isLoading: boolean) => Promise<void>
) => {
  useEffect(() => {
    let mounted = true;
    console.log("useAuthStateChange: Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        
        console.log("useAuthStateChange: Auth state changed:", {
          event: _event,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });

        await updateAuthState(session?.user || null, false);
      }
    );

    return () => {
      console.log("useAuthStateChange: Cleaning up auth state listener");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);
};