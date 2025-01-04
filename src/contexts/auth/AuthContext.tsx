import { createContext, useContext, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useAdminCheck } from "@/hooks/auth/useAdminCheck";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { state, setState, initializeAuth } = useAuthSession();
  const { checkAdminStatus } = useAdminCheck();

  useEffect(() => {
    console.log("AuthProvider: Initializing with state:", {
      userId: state.user?.id,
      isLoading: state.isLoading,
      timestamp: new Date().toISOString()
    });
    
    let mounted = true;

    initializeAuth(mounted);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider: Auth state changed:", { 
          event, 
          userId: session?.user?.id,
          isLoading: false,
          timestamp: new Date().toISOString(),
          sessionDetails: session
        });

        if (!mounted) {
          console.log("AuthProvider: Component unmounted, skipping state update");
          return;
        }

        setState(prev => ({ ...prev, isLoading: false }));

        try {
          if (session?.user) {
            console.log("AuthProvider: Processing signed in user:", {
              userId: session.user.id,
              isLoading: false,
              timestamp: new Date().toISOString()
            });
            
            const isAdmin = await checkAdminStatus(session.user.id);
            
            if (mounted) {
              setState({ user: session.user, isLoading: false, isAdmin });
              console.log("AuthProvider: State updated after sign in:", {
                userId: session.user.id,
                isLoading: false,
                isAdmin,
                timestamp: new Date().toISOString()
              });
            }
          } else {
            console.log("AuthProvider: No session, updating state:", {
              isLoading: false,
              timestamp: new Date().toISOString()
            });
            
            if (mounted) {
              setState({ user: null, isLoading: false, isAdmin: false });
            }
          }
        } catch (error) {
          console.error("AuthProvider: Error processing auth state change:", error);
          if (mounted) {
            setState({ user: null, isLoading: false, isAdmin: false });
          }
        }
      }
    );

    return () => {
      console.log("AuthProvider: Cleanup - unmounting", {
        userId: state.user?.id,
        isLoading: state.isLoading,
        timestamp: new Date().toISOString()
      });
      mounted = false;
      subscription.unsubscribe();
    };
  }, [state.user?.id, state.isLoading, setState, initializeAuth, checkAdminStatus]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setState({ user: null, isLoading: false, isAdmin: false });
    } catch (error) {
      console.error("AuthProvider: Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};