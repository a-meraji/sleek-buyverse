import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string | null;
  content: string;
  is_read: boolean;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return;

      const unreadAdminMessages = messages.filter(
        (msg) => !msg.is_read && !msg.sender_id
      );

      if (unreadAdminMessages.length > 0) {
        console.log('Marking messages as read:', unreadAdminMessages.map(m => m.id));
        const { error } = await supabase
          .from('chat_messages')
          .update({ is_read: true })
          .in('id', unreadAdminMessages.map(m => m.id));

        if (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    markMessagesAsRead();
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden px-6">
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="space-y-4 pr-4">
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
    </div>
  );
};