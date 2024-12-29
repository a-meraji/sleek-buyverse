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
      
      // First get all active sessions
      const { data: chatSessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('status', 'active')
        .order('last_message_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        throw sessionsError;
      }

      // Then for each session, get the unread count
      const sessionsWithUnreadCounts = await Promise.all(
        chatSessions.map(async (session) => {
          let query = supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id)
            .eq('is_read', false);

          // If there's an admin assigned, only count messages not from them
          if (session.admin_id) {
            query = query.neq('sender_id', session.admin_id);
          }

          const { count, error: countError } = await query;

          if (countError) {
            console.error('Error counting unread messages:', countError);
            return {
              ...session,
              user_email: 'User ' + (session.user_id?.slice(0, 4) || 'Anonymous'),
              unread_count: 0
            };
          }

          console.log(`Session ${session.id} has ${count} unread messages`);
          
          return {
            ...session,
            user_email: 'User ' + (session.user_id?.slice(0, 4) || 'Anonymous'),
            unread_count: count || 0
          };
        })
      );

      console.log('Sessions with unread counts:', sessionsWithUnreadCounts);
      return sessionsWithUnreadCounts;
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
                  <Badge variant="destructive" />
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