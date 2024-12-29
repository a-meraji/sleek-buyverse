import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          {session.unread_count > 0 && (
            <Badge variant="destructive" className="w-2 h-2 rounded-full p-0" />
          )}
        </div>
        <CardDescription className="text-xs">
          {new Date(session.last_message_at).toLocaleString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};