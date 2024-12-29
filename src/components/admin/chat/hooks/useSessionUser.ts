import { supabase } from "@/integrations/supabase/client";
import { chatLogger } from "../utils/chatLogger";

export const useSessionUser = () => {
  const getCurrentUser = async () => {
    chatLogger.info('Getting current session');
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    chatLogger.info('Session response', { session, error: sessionError });
    
    if (sessionError) {
      chatLogger.error('Session error', sessionError);
      throw new Error('Authentication error');
    }

    if (!session) {
      chatLogger.error('No session found');
      throw new Error('No session found');
    }

    if (!session.user) {
      chatLogger.error('No user object in session');
      throw new Error('No user object found in session');
    }

    if (!session.user.id) {
      chatLogger.error('No user ID in session user object');
      throw new Error('No user ID found');
    }

    chatLogger.success('Got sender_id', session.user.id);
    return session.user;
  };

  return { getCurrentUser };
};