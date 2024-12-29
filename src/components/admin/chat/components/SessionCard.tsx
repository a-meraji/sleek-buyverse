import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

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
  const [unreadCount, setUnreadCount] = useState(session.unread_count);
  const queryClient = useQueryClient();

  useEffect(() => {
    setUnreadCount(session.unread_count);

    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          console.log('Message updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', session.id] });
          // Update local unread count
          if (payload.new.is_read && !payload.old.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.id, session.unread_count, queryClient]);

  return (
    <Card
      className={`mb-2 cursor-pointer ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onSelect(session.id)}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            {session.user_email || "Anonymous"}
          </CardTitle>
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="h-6 w-6 flex items-center justify-center rounded-full p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          {new Date(session.last_message_at).toLocaleString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};