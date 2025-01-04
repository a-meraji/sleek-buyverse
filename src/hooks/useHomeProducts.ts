import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

export const useHomeProducts = () => {
  const { isInitialized } = useAuthState();

  return useQuery({
    queryKey: ["home-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: isInitialized,
  });
};