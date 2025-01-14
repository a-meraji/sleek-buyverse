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
          *,
          email:auth.users(email)
        `);

      if (searchQuery) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%,` +
          `last_name.ilike.%${searchQuery}%,` +
          `phone.ilike.%${searchQuery}%,` +
          `postal_code.ilike.%${searchQuery}%,` +
          `auth.users.email.ilike.%${searchQuery}%`
        );
      }

      const { data: profiles, error } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      console.log("Fetched profiles:", profiles);
      return profiles.map((profile: any) => ({
        ...profile,
        email: profile.email?.[0]?.email,
      })) as ProfileData[];
    },
  });
}