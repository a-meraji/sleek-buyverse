import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ChatWindow } from "./ChatWindow";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadCount = 0, refetch } = useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return 0;

      console.log('Fetching unread messages count...');
      
      // Get user's chat sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('status', 'active');

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return 0;
      }

      if (!sessions.length) return 0;

      // Count unread messages from admin in user's sessions
      const sessionIds = sessions.map(s => s.id);
      const { count, error: countError } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .in('session_id', sessionIds)
        .eq('is_read', false)
        .is('sender_id', null); // Messages from admin have null sender_id

      if (countError) {
        console.error('Error counting unread messages:', countError);
        return 0;
      }

      console.log('Unread messages count:', count);
      return count || 0;
    },
    enabled: true,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  useEffect(() => {
    const channel = supabase
      .channel('chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
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
  }, [refetch]);

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full size-12 shadow-lg relative"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="size-6" />
        {unreadCount > 0 && (
          <Badge 
            variant="default"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 bg-[#0EA5E9] text-[0.7rem] font-light text-white"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      <ChatWindow open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};