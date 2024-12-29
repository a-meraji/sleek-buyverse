import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
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
  const [adminIds, setAdminIds] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminIds = async () => {
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select('id');

      if (error) {
        console.error('Error fetching admin users:', error);
        return;
      }

      setAdminIds(adminUsers.map(admin => admin.id));
    };

    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
      }
    };

    fetchAdminIds();
    getCurrentUser();
  }, []);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return;

      // Find unread admin messages
      const unreadAdminMessages = messages.filter(
        (msg) => !msg.is_read && adminIds.includes(msg.sender_id || '')
      );

      if (unreadAdminMessages.length > 0) {
        console.log('Marking admin messages as read:', unreadAdminMessages.map(m => m.id));
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
  }, [messages, adminIds]);

  return (
    <div className="flex-1 overflow-hidden px-6">
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="space-y-4 pr-4">
          {messages.map((message) => {
            const isCurrentUser = message.sender_id === currentUserId;
            const isAdmin = adminIds.includes(message.sender_id || '');
            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : isAdmin
                      ? "bg-blue-100"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};