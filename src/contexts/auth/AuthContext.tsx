import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
  });

  useEffect(() => {
    console.log("AuthProvider: Initializing");
    
    let mounted = true;

    const checkAdminStatus = async (userId: string) => {
      try {
        console.log("AuthProvider: Checking admin status for", userId);
        const { data, error } = await supabase
          .from("admin_users")
          .select("role")
          .eq("id", userId)
          .single();

        if (error) throw error;
        return !!data;
      } catch (error) {
        console.error("AuthProvider: Admin check error:", error);
        return false;
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          console.log("AuthProvider: Session found for user:", session.user.id);
          const isAdmin = await checkAdminStatus(session.user.id);
          setState({ user: session.user, isLoading: false, isAdmin });
        } else {
          console.log("AuthProvider: No session found");
          setState({ user: null, isLoading: false, isAdmin: false });
        }
      } catch (error) {
        console.error("AuthProvider: Init error:", error);
        if (mounted) {
          setState({ user: null, isLoading: false, isAdmin: false });
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider: Auth state changed:", { event, userId: session?.user?.id });

        if (!mounted) return;

        if (session?.user) {
          const isAdmin = await checkAdminStatus(session.user.id);
          setState({ user: session.user, isLoading: false, isAdmin });
        } else {
          setState({ user: null, isLoading: false, isAdmin: false });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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