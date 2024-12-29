import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const { data, refetch } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      console.log('Fetching unread admin messages count...');
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return 0;

      // First get the admin user IDs
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('id');

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        return 0;
      }

      const adminIds = adminUsers.map(admin => admin.id);

      // Get the user's chat session
      const { data: chatSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', session.session.user.id)
        .maybeSingle();

      if (sessionError || !chatSession) {
        console.error('Error fetching chat session:', sessionError);
        return 0;
      }

      // Count unread messages from admins
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .in('sender_id', adminIds)
        .eq('session_id', chatSession.id);

      if (error) {
        console.error('Error fetching unread messages:', error);
        return 0;
      }

      console.log('Unread admin messages count:', count);
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