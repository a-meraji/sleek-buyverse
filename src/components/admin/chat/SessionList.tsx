import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { SessionCard } from "./components/SessionCard";
import { SessionHeader } from "./components/SessionHeader";
import { useSessionList } from "./hooks/useSessionList";
import { useQueryClient } from "@tanstack/react-query";

interface SessionListProps {
  selectedSession: string | null;
  onSelectSession: (sessionId: string) => void;
}

export const SessionList = ({ selectedSession, onSelectSession }: SessionListProps) => {
  const { data: sessions = [], refetch } = useSessionList();
  const queryClient = useQueryClient();

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
        (payload) => {
          console.log('Chat session changed:', payload);
          if (payload.eventType === 'INSERT') {
            console.log('New chat session created:', payload.new);
          }
          queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('Chat message changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
          refetch();
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