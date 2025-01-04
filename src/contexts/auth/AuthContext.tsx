import { createContext, useContext, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuthInitialization } from "@/hooks/auth/useAuthInitialization";
import { useAuthStateChange } from "@/hooks/auth/useAuthStateChange";

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
  const { state, updateAuthState, initializeAuth } = useAuthInitialization();
  
  // Initialize auth on mount
  useEffect(() => {
    console.log("AuthProvider: Starting initialization");
    let mounted = true;

    const initialize = async () => {
      if (mounted) {
        await initializeAuth();
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [initializeAuth]);

  // Set up auth state change listener
  useAuthStateChange(updateAuthState);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      await updateAuthState(null, false);
    } catch (error) {
      console.error("AuthProvider: Sign out error:", error);
    }
  };

  const value = {
    ...state,
    signOut
  };

  console.log("AuthProvider: Rendering with state:", {
    userId: state.user?.id,
    isLoading: state.isLoading,
    isAdmin: state.isAdmin,
    timestamp: new Date().toISOString()
  });

  return (
    <AuthContext.Provider value={value}>
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