import { createContext, useContext, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

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
          isLoading: state.isLoading,
          timestamp: new Date().toISOString(),
          sessionDetails: session
        });

        if (!mounted) return;

        if (session?.user) {
          const isAdmin = await useAdminCheck().checkAdminStatus(session.user.id);
          setState({ user: session.user, isLoading: false, isAdmin });
        } else {
          setState({ user: null, isLoading: false, isAdmin: false });
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
  }, [state.user?.id, state.isLoading, setState, initializeAuth]);

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