import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const { data, refetch } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      console.log('Fetching unread messages count...');
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return 0;

      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .isNull('sender_id') // Messages from admin have null sender_id
        .eq('session_id', (
          await supabase
            .from('chat_sessions')
            .select('id')
            .eq('user_id', session.session.user.id)
            .single()
        ).data?.id);

      if (error) {
        console.error('Error fetching unread messages:', error);
        return 0;
      }

      console.log('Unread messages count:', count);
      return count || 0;
    },
    enabled: true,
  });

  useEffect(() => {
    setUnreadCount(data || 0);
  }, [data]);

  useEffect(() => {
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          console.log('Chat message updated, refetching unread count...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return unreadCount;
};