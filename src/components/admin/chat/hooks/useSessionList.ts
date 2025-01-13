import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ChatSession {
  id: string;
  user_id: string | null;
  admin_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  user_email: string | null;
  unread_count: number;
}

export const useSessionList = () => {
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

      // Get admin status
      const { data: isAdminData } = await supabase.rpc('is_admin', {
        user_id: currentUserId
      });
      const isAdmin = isAdminData;

      console.log('Current user is admin:', isAdmin);

      const { data: chatSessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*, profiles!chat_sessions_user_id_fkey(first_name, last_name, id)')
        .eq('status', 'active')
        .order('last_message_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        throw sessionsError;
      }

      const sessionsWithUnreadCounts = await Promise.all(
        chatSessions.map(async (session) => {
          console.log(`Counting unread messages for session ${session.id}`);
          
          // If admin, count unread messages from users
          // If user, count unread messages from admins
          const query = supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', session.id)
            .eq('is_read', false);

          if (isAdmin) {
            // For admins, count unread messages from users
            query.neq('sender_id', currentUserId);
          } else {
            // For users, count unread messages from admins
            query.eq('sender_id', currentUserId);
          }

          const { data: messages, error: messagesError } = await query;

          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
            return {
              ...session,
              user_email: session.user_id || 'Anonymous',
              unread_count: 0
            };
          }

          const unreadCount = messages ? messages.length : 0;
          console.log(`Unread count for session ${session.id}:`, unreadCount);

          return {
            ...session,
            user_email: session.user_id || 'Anonymous',
            unread_count: unreadCount
          };
        })
      );

      console.log('Sessions with unread counts:', sessionsWithUnreadCounts);
      return sessionsWithUnreadCounts;
    },
  });
};