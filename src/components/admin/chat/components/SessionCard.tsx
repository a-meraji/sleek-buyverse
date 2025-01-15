import React from 'react';
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { SessionBadge } from './session-card/SessionBadge';
import { SessionUserInfo } from './session-card/SessionUserInfo';
import { useSessionUser } from './session-card/useSessionUser';

interface SessionCardProps {
  session: {
    id: string;
    user_email: string | null;
    last_message_at: string;
    unread_count: number;
  };
  isSelected: boolean;
  onSelect: (sessionId: string) => void;
}

export const SessionCard = ({ session, isSelected, onSelect }: SessionCardProps) => {
  const queryClient = useQueryClient();
  const { displayName } = useSessionUser(session.id);

  useEffect(() => {
    console.log('Setting up realtime listeners for session:', session.id);
    
    const channel = supabase
      .channel(`chat-updates-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          console.log('Message changed for session:', session.id, payload);
          queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', session.id] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime listeners for session:', session.id);
      supabase.removeChannel(channel);
    };
  }, [session.id, queryClient]);

  return (
    <Card
      className={`mb-2 cursor-pointer ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onSelect(session.id)}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <SessionUserInfo 
            displayName={displayName}
            email={session.user_email}
          />
          <SessionBadge count={session.unread_count} />
        </div>
        <CardDescription className="text-xs mt-2">
          {new Date(session.last_message_at).toLocaleString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};