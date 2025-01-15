import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { SessionCard } from "./components/SessionCard";
import { SessionHeader } from "./components/SessionHeader";
import { useSessionList } from "./hooks/useSessionList";
import { useQueryClient } from "@tanstack/react-query";
import { useUnreadAdminMessages } from "./hooks/useUnreadAdminMessages";

interface SessionListProps {
  selectedSession: string | null;
  onSelectSession: (sessionId: string) => void;
}

export const SessionList = ({ selectedSession, onSelectSession }: SessionListProps) => {
  const { data: sessions = [], refetch } = useSessionList();
  const queryClient = useQueryClient();
  // Add this to trigger refetch when unread count changes
  const { data: unreadMessages } = useUnreadAdminMessages();

  useEffect(() => {
    console.log('Setting up realtime listeners for chat sessions...');
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions'
        },
        async (payload) => {
          console.log('Chat session changed:', payload);
          if (payload.eventType === 'INSERT') {
            console.log('New chat session created:', payload.new);
            // Immediately invalidate and refetch to show new session
            await queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
            await refetch();
          } else {
            // For updates and deletes, also refresh the data
            await queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
            await refetch();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        async (payload) => {
          console.log('Chat message changed:', payload);
          // Refresh sessions to update last message timestamps and unread counts
          await queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
          await refetch();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime listeners...');
      supabase.removeChannel(channel);
    };
  }, [refetch, queryClient]);

  // Add this effect to refetch when unread count changes
  useEffect(() => {
    console.log('Unread messages changed, refetching sessions...');
    refetch();
  }, [unreadMessages, refetch]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none pb-4">
        <SessionHeader />
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pr-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isSelected={selectedSession === session.id}
                onSelect={onSelectSession}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};