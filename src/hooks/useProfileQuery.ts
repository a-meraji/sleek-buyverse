import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  shipping_address: string | null;
}

export const useProfileQuery = (userId: string | null) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      console.log('useProfileQuery: Starting profile fetch...');
      
      if (!userId) {
        console.log('useProfileQuery: No user ID available');
        return null;
      }

      try {
        console.log('useProfileQuery: Fetching profile data...');
        const startTime = performance.now();
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        const endTime = performance.now();
        console.log(`Profile query took ${endTime - startTime}ms`);

        if (error) {
          console.error('useProfileQuery: Error fetching profile:', error);
          throw error;
        }

        console.log('useProfileQuery: Fetch successful:', {
          profileData: data,
          timestamp: new Date().toISOString()
        });

        return data as Profile;
      } catch (err) {
        console.error('useProfileQuery: Unexpected error:', err);
        throw err;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};