import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

interface MessageListProps {
  sessionId: string | null;
}

export const MessageList = ({ sessionId }: MessageListProps) => {
  const { data: messages = [], refetch } = useQuery({
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

      // Mark messages as read only if they're from the user (sender_id is not null)
      // and they're currently unread
      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('session_id', sessionId)
        .eq('is_read', false)
        .not('sender_id', 'is', null); // Only mark user messages as read

      if (updateError) {
        console.error('Error marking messages as read:', updateError);
      }

      console.log('Fetched messages:', data);
      return data;
    },
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, refetch]);

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.sender_id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};