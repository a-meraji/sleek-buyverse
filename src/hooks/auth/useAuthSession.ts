import { useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCheck } from "./useAdminCheck";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export const useAuthSession = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
  });
  const { checkAdminStatus } = useAdminCheck();

  const initializeAuth = useCallback(async (mounted: boolean) => {
    console.log("useAuthSession: Starting initialization with state:", {
      currentUser: state.user?.id,
      isLoading: state.isLoading,
      timestamp: new Date().toISOString()
    });

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("useAuthSession: Session error:", error);
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
        return;
      }

      if (session?.user) {
        console.log("useAuthSession: Session found for user:", {
          userId: session.user.id,
          isLoading: state.isLoading,
          timestamp: new Date().toISOString()
        });
        const isAdmin = await checkAdminStatus(session.user.id);
        if (mounted) {
          setState({ user: session.user, isLoading: false, isAdmin });
        }
      } else {
        console.log("useAuthSession: No session found", {
          isLoading: state.isLoading,
          timestamp: new Date().toISOString()
        });
        if (mounted) {
          setState({ user: null, isLoading: false, isAdmin: false });
        }
      }
    } catch (error) {
      console.error("useAuthSession: Init error:", error);
      if (mounted) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [state, checkAdminStatus]);

  return { state, setState, initializeAuth };
};