import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types/chat";

export const useUserProfiles = () => {
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    console.log('Fetching profile for user:', userId);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    console.log(`Found profile for user ${userId}:`, profile);
    return profile;
  };

  return { fetchUserProfile };
};