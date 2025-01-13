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
  const [userProfile, setUserProfile] = useState<{ first_name: string | null; last_name: string | null } | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session.user_email) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.id)
          .single();
        
        if (profiles) {
          setUserProfile(profiles);
        }
      }
    };

    fetchUserProfile();
  }, [session.id, session.user_email]);

  useEffect(() => {
    console.log('Session unread count updated:', session.unread_count);
    setUnreadCount(session.unread_count);
  }, [session.unread_count]);

  useEffect(() => {
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
          queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', session.id] });
        }
      )
      .subscribe();

    // Also listen for new messages
    const newMessageChannel = supabase
      .channel('new-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Get current user session
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          const currentUserId = currentSession?.user?.id;
          
          // Only increment unread count if message is from user (not from current admin)
          if (payload.new.sender_id && !payload.new.is_read && payload.new.sender_id !== currentUserId) {
            console.log('Increasing unread count for new message from user');
            setUnreadCount(prev => prev + 1);
          }
          
          queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', session.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(newMessageChannel);
    };
  }, [session.id, queryClient]);

  const displayName = userProfile 
    ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() 
    : 'Anonymous';

  return (
    <Card
      className={`mb-2 cursor-pointer ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onSelect(session.id)}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              {displayName}
            </CardTitle>
            {session.user_email && (
              <CardDescription className="text-xs text-muted-foreground">
                {session.user_email}
              </CardDescription>
            )}
          </div>
          {unreadCount > 0 && (
            <Badge 
              variant="default"
              className="h-5 w-5 flex items-center justify-center rounded-full p-0 bg-[#0EA5E9] text-[0.7rem] font-light text-white"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs mt-2">
          {new Date(session.last_message_at).toLocaleString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};