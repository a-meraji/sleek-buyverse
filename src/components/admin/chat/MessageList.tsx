import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "./hooks/useMessages";
import { useMarkMessagesAsRead } from "./hooks/useMarkMessagesAsRead";
import { Message } from "./components/Message";
import { useQueryClient } from "@tanstack/react-query";

interface MessageListProps {
  sessionId: string | null;
}

export const MessageList = ({ sessionId }: MessageListProps) => {
  const { data: messages = [], refetch } = useMessages(sessionId);
  const { markMessagesAsRead } = useMarkMessagesAsRead();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessionId || !messages.length) return;
    
    markMessagesAsRead(messages, sessionId).then((updatedMessages) => {
      // Get the count of remaining unread messages from users
      const unreadCount = updatedMessages.filter(
        msg => !msg.is_read && msg.sender_id !== null
      ).length;
      
      console.log('Updating session with unread count:', unreadCount);
      
      // Update the sessions cache with new unread count
      queryClient.setQueryData(['chat-sessions'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((session: any) => {
          if (session.id === sessionId) {
            return { ...session, unread_count: unreadCount };
          }
          return session;
        });
      });
      
      refetch();
    });
  }, [messages, sessionId, refetch, queryClient]);

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
    <ScrollArea className="flex-1 pr-4 h-[80vh]">
      <div className="space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
};