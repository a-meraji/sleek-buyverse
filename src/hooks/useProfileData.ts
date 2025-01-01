import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  shipping_address: string | null;
}

export const useProfileData = () => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    userId: string | null;
  }>({
    isAuthenticated: false,
    userId: null,
  });

  useEffect(() => {
    console.log('useProfileData: Hook initialized');
    
    const initializeAuth = async () => {
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
      console.log('useProfileData: Auth state changed:', {
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

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', authState.userId],
    queryFn: async () => {
      console.log('useProfileData: Starting profile fetch...');
      console.log('useProfileData: Auth state:', authState);

      if (!authState.userId) {
        console.log('useProfileData: No user ID available');
        return null;
      }

      try {
        console.log('useProfileData: Fetching profile data...');
        const startTime = performance.now();
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authState.userId)
          .single();

        const endTime = performance.now();
        console.log(`Profile query took ${endTime - startTime}ms`);

        if (error) {
          console.error('useProfileData: Error fetching profile:', error);
          throw error;
        }

        console.log('useProfileData: Fetch successful:', {
          profileData: data,
          timestamp: new Date().toISOString()
        });

        return data as Profile;
      } catch (err) {
        console.error('useProfileData: Unexpected error:', err);
        throw err;
      }
    },
    enabled: !!authState.userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    profile,
    isLoading,
    error,
    isAuthenticated: authState.isAuthenticated,
    userId: authState.userId,
  };
};