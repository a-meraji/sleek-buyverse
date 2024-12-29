import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMessages = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['admin-chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      
      console.log('Fetching messages for session:', sessionId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      console.log('Fetched messages:', data);
      return data;
    },
    enabled: !!sessionId,
  });
};