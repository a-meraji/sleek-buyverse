import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

interface SessionListProps {
  selectedSession: string | null;
  onSelectSession: (sessionId: string) => void;
}

interface ChatSession {
  id: string;
  user_id: string | null;
  admin_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  user_email: string | null;
  unread_count: number;
}

export const SessionList = ({ selectedSession, onSelectSession }: SessionListProps) => {
  const { data: sessions = [], refetch } = useQuery<ChatSession[]>({
    queryKey: ['chat-sessions'],
    queryFn: async () => {
      console.log('Fetching chat sessions...');
      const { data: chatSessions, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          unread_count:chat_messages(count)
        `)
        .eq('status', 'active')
        .eq('chat_messages.is_read', false)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        throw error;
      }

      const sessionsWithEmails = chatSessions?.map(session => ({
        ...session,
        user_email: 'User ' + (session.user_id?.slice(0, 4) || 'Anonymous'),
        unread_count: session.unread_count?.[0]?.count || 0
      }));

      console.log('Fetched sessions:', sessionsWithEmails);
      return sessionsWithEmails || [];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions'
        },
        (payload) => {
          console.log('Chat session changed:', payload);
          refetch();
        }
      )
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Active Chats</h3>
      <ScrollArea className="h-[calc(100vh-14rem)]">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className={`mb-2 cursor-pointer ${
              selectedSession === session.id ? "border-primary" : ""
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  {session.user_email || "Anonymous"}
                </CardTitle>
                {session.unread_count > 0 && (
                  <Badge variant="destructive">
                    {session.unread_count}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                {new Date(session.last_message_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};