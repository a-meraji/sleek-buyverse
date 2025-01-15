import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSessionUser } from '../hooks/useSessionUser';

interface MessageProps {
  message: {
    id: string;
    sender_id: string | null;
    content: string;
  };
}

export const Message = ({ message }: MessageProps) => {
  const { getCurrentUser } = useSessionUser();
  
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  });

  const isCurrentUser = user?.id === message.sender_id;

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-blue-50"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};