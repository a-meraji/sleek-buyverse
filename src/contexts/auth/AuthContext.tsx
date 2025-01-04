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
    isAdmin: false
  });

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("AuthProvider: Checking admin status for", userId);
      const { data, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Admin check error:", error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error("Admin check failed:", error);
      return false;
    }
  };

  const initializeAuth = async () => {
    try {
      console.log("AuthProvider: Initializing auth");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id);
        setState({
          user: session.user,
          isLoading: false,
          isAdmin
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAdmin: false
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log("AuthProvider: Setting up");
    
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state changed:", { event, userId: session?.user?.id });

        if (session?.user) {
          const isAdmin = await checkAdminStatus(session.user.id);
          setState({
            user: session.user,
            isLoading: false,
            isAdmin
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            isAdmin: false
          });
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
      setState({
        user: null,
        isLoading: false,
        isAdmin: false
      });
    } catch (error) {
      console.error("Sign out error:", error);
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