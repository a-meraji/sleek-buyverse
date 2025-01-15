import { supabase } from "@/integrations/supabase/client";
import { ChatSession } from "../types/chat";
import { useUserProfiles } from "./useUserProfiles";

export const useFetchSessions = () => {
  const { fetchUserProfile } = useUserProfiles();

  const fetchUnreadCount = async (sessionId: string, currentUserId: string, isAdmin: boolean) => {
    console.log('Fetching unread count for session:', sessionId);
    
    const query = supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('session_id', sessionId)
      .eq('is_read', false);

    if (isAdmin) {
      // For admins, count unread messages from users (not from other admins)
      query.not('sender_id', 'is', null).neq('sender_id', currentUserId);
    } else {
      // For users, count unread messages from admins
      query.eq('sender_id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error counting unread messages:', error);
      throw error;
    }

    const count = data?.length || 0;
    console.log(`Unread count for session ${sessionId}:`, count);
    return count;
  };

  const fetchSessions = async () => {
    console.log('Fetching chat sessions...');
    
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      console.error('No current user found');
      return [];
    }

    const { data: isAdminData } = await supabase.rpc('is_admin', {
      user_id: currentUserId
    });
    const isAdmin = isAdminData;
    console.log('Current user is admin:', isAdmin);

    const { data: chatSessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('status', 'active')
      .order('last_message_at', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      throw sessionsError;
    }

    const sessionsWithProfiles = await Promise.all(
      chatSessions.map(async (session) => {
        const profile = session.user_id ? await fetchUserProfile(session.user_id) : null;
        const unreadCount = await fetchUnreadCount(session.id, currentUserId, isAdmin);

        return {
          ...session,
          user_email: profile?.email || 'Anonymous',
          unread_count: unreadCount
        };
      })
    );

    console.log('Sessions with profiles:', sessionsWithProfiles);
    return sessionsWithProfiles;
  };

  return { fetchSessions };
};