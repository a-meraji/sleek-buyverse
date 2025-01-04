import { useAuthState } from "@/hooks/useAuthState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileData = () => {
  const { userId, isAuthenticated } = useAuthState();

  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId || !isAuthenticated) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId && isAuthenticated,
  });
};