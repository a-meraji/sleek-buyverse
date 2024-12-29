import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "./hooks/useMessages";
import { useMarkMessagesAsRead } from "./hooks/useMarkMessagesAsRead";
import { Message } from "./components/Message";

interface MessageListProps {
  sessionId: string | null;
}

export const MessageList = ({ sessionId }: MessageListProps) => {
  const { data: messages = [], refetch } = useMessages(sessionId);
  const { markMessagesAsRead } = useMarkMessagesAsRead();

  useEffect(() => {
    if (!sessionId || !messages.length) return;
    
    markMessagesAsRead(messages, sessionId).then(() => {
      refetch();
    });
  }, [messages, sessionId, refetch]);

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
          <Message key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
};