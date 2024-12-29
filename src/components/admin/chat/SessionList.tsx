import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { SessionCard } from "./components/SessionCard";
import { SessionHeader } from "./components/SessionHeader";
import { useSessionList } from "./hooks/useSessionList";

interface SessionListProps {
  selectedSession: string | null;
  onSelectSession: (sessionId: string) => void;
}

export const SessionList = ({ selectedSession, onSelectSession }: SessionListProps) => {
  const { data: sessions = [], refetch } = useSessionList();

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
      <SessionHeader />
      <ScrollArea className="h-[calc(100vh-14rem)]">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            isSelected={selectedSession === session.id}
            onSelect={onSelectSession}
          />
        ))}
      </ScrollArea>
    </div>
  );
};