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
      
      const { data: chatSessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('status', 'active')
        .order('last_message_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        throw sessionsError;
      }

      const sessionsWithUnreadCounts = await Promise.all(
        chatSessions.map(async (session) => {
          let query = supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id)
            .eq('is_read', false);

          if (session.admin_id) {
            query = query.neq('sender_id', session.admin_id);
          }

          const { count, error: countError } = await query;

          if (countError) {
            console.error('Error counting unread messages:', countError);
            return {
              ...session,
              user_email: 'User ' + (session.user_id?.slice(0, 4) || 'Anonymous'),
              unread_count: 0
            };
          }

          console.log(`Session ${session.id} has ${count} unread messages`);
          
          return {
            ...session,
            user_email: 'User ' + (session.user_id?.slice(0, 4) || 'Anonymous'),
            unread_count: count || 0
          };
        })
      );

      console.log('Sessions with unread counts:', sessionsWithUnreadCounts);
      return sessionsWithUnreadCounts;
    },
  });
};