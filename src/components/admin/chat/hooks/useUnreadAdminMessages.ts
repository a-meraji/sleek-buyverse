import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useUnreadAdminMessages = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up real-time subscription for unread messages...');
    
    const channel = supabase
      .channel('admin-unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        () => {
          console.log('Received real-time update for chat messages, invalidating query...');
          queryClient.invalidateQueries({ queryKey: ['admin-unread-messages'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['admin-unread-messages'],
    queryFn: async () => {
      console.log('Fetching unread messages count for admin...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return 0;

      // Get all active chat sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('status', 'active');

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return 0;
      }

      if (!sessions.length) return 0;

      // Count unread messages from users in active sessions
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .in('session_id', sessions.map(s => s.id))
        .is('sender_id', 'not.null') // Only count messages from users, not from admins
        .neq('sender_id', session.user.id); // Exclude current admin's messages

      if (error) {
        console.error('Error counting unread messages:', error);
        return 0;
      }

      console.log('Unread messages count:', count);
      return count || 0;
    },
    refetchInterval: 10000, // Keep the refetch interval as a fallback
  });
};