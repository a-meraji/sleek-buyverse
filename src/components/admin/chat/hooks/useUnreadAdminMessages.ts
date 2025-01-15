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
        (payload) => {
          console.log('Received real-time update for chat messages:', payload);
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
      if (!session?.user?.id) {
        console.log('No authenticated user found');
        return 0;
      }

      // First verify if the user is an admin
      const { data: isAdmin } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });

      if (!isAdmin) {
        console.log('User is not an admin');
        return 0;
      }

      // Get all active chat sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('status', 'active');

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        throw sessionsError;
      }

      if (!sessions.length) {
        console.log('No active sessions found');
        return 0;
      }

      // Count unread messages from users in active sessions
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact' })
        .eq('is_read', false)
        .in('session_id', sessions.map(s => s.id))
        .not('sender_id', 'is', null); // Only count messages from users

      if (error) {
        console.error('Error counting unread messages:', error);
        throw error;
      }

      const count = data?.length || 0;
      console.log('Unread messages count:', count);
      return count;
    },
    refetchInterval: 10000, // Keep the refetch interval as a fallback
  });
};