import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthStatus = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      console.log("Admin status check:", { adminData, adminError });

      if (adminError) {
        console.error("Admin check error:", adminError);
        return false;
      }

      return !!adminData;
    } catch (error) {
      console.error("Unexpected error during admin check:", error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        console.log("Initializing session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (mounted) {
            toast({
              title: "Authentication Error",
              description: "Please sign in to access all features",
              variant: "destructive",
            });
          }
          return;
        }

        if (session?.user) {
          console.log("Session found for user:", session.user.id);
          if (mounted) {
            await checkAdminStatus(session.user.id);
            setUser(session.user);
          }
        } else {
          console.log("No active session found");
          if (mounted) setUser(null);
        }
      } catch (err) {
        console.error("Session initialization error:", err);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      
      if (session?.user) {
        if (mounted) {
          await checkAdminStatus(session.user.id);
          setUser(session.user);
        }
        
        if (_event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You've successfully signed in",
          });
        }
      } else {
        if (mounted) setUser(null);
        
        if (_event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You've been signed out successfully",
          });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return { user, setUser };
};