import React from 'react';

interface MessageProps {
  message: {
    id: string;
    sender_id: string | null;
    content: string;
  };
}

export const Message = ({ message }: MessageProps) => {
  return (
    <div
      className={`flex ${
        message.sender_id ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
          message.sender_id
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};