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
      console.log("AuthProvider: Starting admin check for", userId);
      
      console.log("AuthProvider: Executing admin query...");
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")  // Changed to select all columns for debugging
        .eq("id", userId)
        .single();  // Changed from maybeSingle to single for more direct error handling
      
      console.log("AuthProvider: Raw query response:", { data, error, timestamp: new Date().toISOString() });
      
      if (error) {
        console.error("AuthProvider: Admin check query error:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          timestamp: new Date().toISOString()
        });
        return false;
      }

      if (!data) {
        console.log("AuthProvider: No admin record found");
        return false;
      }

      console.log("AuthProvider: Admin record found:", {
        userId,
        role: data.role,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error("AuthProvider: Admin check failed with exception:", {
        error,
        userId,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined
      });
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
        console.log("AuthProvider: Session found for user:", session.user.id);
        const isAdmin = await checkAdminStatus(session.user.id);
        console.log("AuthProvider: Admin status result:", isAdmin);
        setState({
          user: session.user,
          isLoading: false,
          isAdmin
        });
      } else {
        console.log("AuthProvider: No active session");
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

        console.log("Auth state changed:", { 
          event, 
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });

        if (session?.user) {
          console.log("AuthProvider: Processing auth state change for user:", session.user.id);
          const isAdmin = await checkAdminStatus(session.user.id);
          console.log("AuthProvider: Updated admin status:", {
            userId: session.user.id,
            isAdmin,
            timestamp: new Date().toISOString()
          });
          setState({
            user: session.user,
            isLoading: false,
            isAdmin
          });
        } else {
          console.log("AuthProvider: Clearing auth state");
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