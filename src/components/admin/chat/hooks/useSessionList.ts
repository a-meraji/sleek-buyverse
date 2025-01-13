import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatSession } from "../types/chat";
import { useUserProfiles } from "./useUserProfiles";

export const useSessionList = () => {
  const { fetchUserProfile } = useUserProfiles();

  const fetchUnreadCount = async (sessionId: string, currentUserId: string, isAdmin: boolean) => {
    console.log('Fetching unread count for session:', sessionId);
    
    const query = supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('is_read', false);

    // For admins, count unread messages FROM users (where sender is NOT admin)
    // For users, count unread messages FROM admins (where sender is admin)
    if (isAdmin) {
      query.neq('sender_id', currentUserId);
    } else {
      query.eq('sender_id', currentUserId);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error counting unread messages:', error);
      return 0;
    }

    return count || 0;
  };

  return useQuery<ChatSession[]>({
    queryKey: ['chat-sessions'],
    queryFn: async () => {
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
    },
  });
};