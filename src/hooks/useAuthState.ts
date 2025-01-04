import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  isInitialized: boolean;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    isInitialized: false,
  });

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('useAuthState: Starting initialization');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuthState: Session error:', error);
          if (mounted) {
            setAuthState({
              isAuthenticated: false,
              userId: null,
              isInitialized: true,
            });
          }
          return;
        }

        if (session?.user) {
          console.log('useAuthState: Session found for user:', session.user.id);
          if (mounted) {
            setAuthState({
              isAuthenticated: true,
              userId: session.user.id,
              isInitialized: true,
            });
          }
        } else {
          console.log('useAuthState: No active session');
          if (mounted) {
            setAuthState({
              isAuthenticated: false,
              userId: null,
              isInitialized: true,
            });
          }
        }
      } catch (error) {
        console.error('useAuthState: Initialization error:', error);
        if (mounted) {
          setAuthState(state => ({ ...state, isInitialized: true }));
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuthState: Auth state changed:', {
        event,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      if (!mounted) return;

      if (session?.user) {
        setAuthState({
          isAuthenticated: true,
          userId: session.user.id,
          isInitialized: true,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          userId: null,
          isInitialized: true,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};