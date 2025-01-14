import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "./types";

interface UseProfilesProps {
  searchQueries?: {
    name: string;
    phone: string;
    address: string;
    postalCode: string;
  };
}

export function useProfiles({ searchQueries }: UseProfilesProps = {}) {
  return useQuery({
    queryKey: ["admin-profiles", searchQueries],
    queryFn: async () => {
      console.log("Fetching profiles with search queries:", searchQueries);
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
          postal_code
        `);

      if (searchQueries) {
        const conditions = [];

        if (searchQueries.name) {
          conditions.push(
            `first_name.ilike.%${searchQueries.name}%`,
            `last_name.ilike.%${searchQueries.name}%`
          );
        }

        if (searchQueries.phone) {
          conditions.push(`phone.ilike.%${searchQueries.phone}%`);
        }

        if (searchQueries.address) {
          conditions.push(
            `street_address.ilike.%${searchQueries.address}%`,
            `city.ilike.%${searchQueries.address}%`,
            `state.ilike.%${searchQueries.address}%`
          );
        }

        if (searchQueries.postalCode) {
          conditions.push(`postal_code.ilike.%${searchQueries.postalCode}%`);
        }

        if (conditions.length > 0) {
          query = query.or(conditions.join(","));
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      console.log("Fetched profiles:", data);
      return data as ProfileData[];
    },
  });
}