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
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // First check localStorage for existing session
        const storedUser = localStorage.getItem('supabase.auth.user');
        if (storedUser && mounted) {
          const user = JSON.parse(storedUser);
          setAuthState({
            isAuthenticated: true,
            userId: user.id,
          });
        }

        // Then verify with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          console.log('Session found for user:', session.user.id);
          setAuthState({
            isAuthenticated: true,
            userId: session.user.id,
          });
          
          // Update localStorage
          localStorage.setItem('supabase.auth.user', JSON.stringify(session.user));
          localStorage.setItem('supabase.auth.token', session.access_token);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('useAuthState: Auth state changed:', {
        event: _event,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });

      if (mounted) {
        if (session?.user) {
          localStorage.setItem('supabase.auth.user', JSON.stringify(session.user));
          localStorage.setItem('supabase.auth.token', session.access_token);
        } else {
          localStorage.removeItem('supabase.auth.user');
          localStorage.removeItem('supabase.auth.token');
        }

        setAuthState({
          isAuthenticated: !!session?.user,
          userId: session?.user?.id || null,
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