import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

export const useSessionUser = (sessionId: string) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('Fetching user profile for session:', sessionId);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', sessionId)
        .single();
      
      if (profiles) {
        console.log('Found user profile:', profiles);
        setUserProfile(profiles);
      }
    };

    fetchUserProfile();
  }, [sessionId]);

  const displayName = userProfile 
    ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() 
    : 'Anonymous';

  return { userProfile, displayName };
};