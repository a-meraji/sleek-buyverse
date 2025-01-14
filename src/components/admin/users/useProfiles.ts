import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "./types";

interface UseProfilesProps {
  searchQuery?: string;
}

export function useProfiles({ searchQuery }: UseProfilesProps = {}) {
  return useQuery({
    queryKey: ["admin-profiles", searchQuery],
    queryFn: async () => {
      console.log("Fetching profiles with search:", searchQuery);
      let query = supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          phone,
          created_at,
          street_address,
          city,
          state,
          postal_code,
          users!profiles_id_fkey (
            email
          )
        `)
        .returns<ProfileData[]>();

      if (searchQuery) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%,` +
          `last_name.ilike.%${searchQuery}%,` +
          `phone.ilike.%${searchQuery}%,` +
          `postal_code.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      console.log("Fetched profiles:", data);
      return data;
    },
  });
}