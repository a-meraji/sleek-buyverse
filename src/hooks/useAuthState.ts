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
    console.log('useAuthState: Hook initialized');
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Get session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          console.log('useAuthState: Session found for user:', session.user.id);
          localStorage.setItem('supabase.auth.token', session.access_token);
          localStorage.setItem('supabase.auth.user', JSON.stringify(session.user));
          
          setAuthState({
            isAuthenticated: true,
            userId: session.user.id,
            isInitialized: true,
          });
        } else {
          console.log('useAuthState: No active session found');
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('supabase.auth.user');
          
          setAuthState({
            isAuthenticated: false,
            userId: null,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error('useAuthState: Error initializing auth:', error);
        if (mounted) {
          setAuthState(state => ({ ...state, isInitialized: true }));
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('useAuthState: Auth state changed:', { 
        event: _event, 
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      if (!mounted) return;

      if (session?.user) {
        localStorage.setItem('supabase.auth.token', session.access_token);
        localStorage.setItem('supabase.auth.user', JSON.stringify(session.user));
        
        setAuthState({
          isAuthenticated: true,
          userId: session.user.id,
          isInitialized: true,
        });
      } else {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.user');
        
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