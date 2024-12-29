import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  sessionId: string | null;
}

export const MessageList = ({ sessionId }: MessageListProps) => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!sessionId) return;

    console.log('Setting up message subscription for session:', sessionId);

    const fetchMessages = async () => {
      console.log('Fetching messages for session:', sessionId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      console.log('Fetched messages:', data);
      setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`admin-chat-messages-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up message subscription');
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.sender_id
                  ? "bg-muted"
                  : "bg-primary text-primary-foreground"
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