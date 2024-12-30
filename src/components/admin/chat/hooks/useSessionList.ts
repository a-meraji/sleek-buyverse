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

      const { data: chatSessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('status', 'active')
        .order('last_message_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        throw sessionsError;
      }

      // Get all admin users
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('id');

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        throw adminError;
      }

      const adminIds = adminUsers.map(admin => admin.id);
      console.log('Admin IDs:', adminIds);

      const sessionsWithUnreadCounts = await Promise.all(
        chatSessions.map(async (session) => {
          console.log(`Counting unread messages for session ${session.id}`);
          
          // Count unread messages from users (not from admins)
          const { data: messages, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', session.id)
            .eq('is_read', false)
            .not('sender_id', 'in', adminIds);

          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
            return {
              ...session,
              user_email: 'User ' + (session.user_id?.slice(0, 4) || 'Anonymous'),
              unread_count: 0
            };
          }

          // Log the messages for debugging
          console.log(`Unread user messages:`, messages);
          
          // Count messages that are from users (not admins) and are unread
          const unreadCount = messages ? messages.length : 0;
          console.log(`Updating session with unread count:`, unreadCount);

          return {
            ...session,
            user_email: 'User ' + (session.user_id?.slice(0, 4) || 'Anonymous'),
            unread_count: unreadCount
          };
        })
      );

      console.log('Sessions with unread counts:', sessionsWithUnreadCounts);
      return sessionsWithUnreadCounts;
    },
  });
};