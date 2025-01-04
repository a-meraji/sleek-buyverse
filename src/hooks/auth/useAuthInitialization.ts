import { useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCheck } from "./useAdminCheck";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export const useAuthInitialization = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
  });
  const { checkAdminStatus } = useAdminCheck();

  const updateAuthState = useCallback(async (user: User | null, isLoading: boolean) => {
    console.log("useAuthInitialization: Starting state update:", {
      userId: user?.id,
      isLoading,
      currentState: state,
      timestamp: new Date().toISOString()
    });

    try {
      if (user) {
        const isAdmin = await checkAdminStatus(user.id);
        console.log("useAuthInitialization: Admin check completed:", {
          userId: user.id,
          isAdmin,
          timestamp: new Date().toISOString()
        });
        
        setState({
          user,
          isLoading,
          isAdmin
        });
      } else {
        setState({
          user: null,
          isLoading,
          isAdmin: false
        });
      }
    } catch (error) {
      console.error("useAuthInitialization: Error during state update:", error);
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  }, [checkAdminStatus]);

  const initializeAuth = useCallback(async () => {
    console.log("useAuthInitialization: Starting initialization");
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("useAuthInitialization: Session error:", error);
        await updateAuthState(null, false);
        return;
      }

      await updateAuthState(session?.user || null, false);
    } catch (error) {
      console.error("useAuthInitialization: Init error:", error);
      await updateAuthState(null, false);
    }
  }, [updateAuthState]);

  return { state, updateAuthState, initializeAuth };
};