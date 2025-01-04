import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
  });

  useEffect(() => {
    console.log('useAuthState: Hook initialized');
    
    const initializeAuth = async () => {
      // First check localStorage for existing session
      const storedUser = localStorage.getItem('supabase.auth.user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          userId: user.id,
        });
      }

      // Then verify with Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('Session found for user:', session.user.id);
        setAuthState({
          isAuthenticated: true,
          userId: session.user.id,
        });
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('useAuthState: Auth state changed:', {
        event: _event,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });

      setAuthState({
        isAuthenticated: !!session?.user,
        userId: session?.user?.id || null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};