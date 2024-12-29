import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  sessionId: string | null;
}

export const MessageList = ({ sessionId }: MessageListProps) => {
  const { data: messages = [] } = useQuery({
    queryKey: ['admin-chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      
      console.log('Fetching messages for session:', sessionId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*, sender:sender_id(email)')
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
    refetchInterval: 3000, // Refetch every 3 seconds
  });

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