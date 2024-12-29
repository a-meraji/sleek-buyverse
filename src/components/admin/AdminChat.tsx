import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionList } from "./chat/SessionList";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { useAdmin } from "@/hooks/useAdmin";

export const AdminChat = () => {
  const { data: adminStatus, isLoading } = useAdmin();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  if (isLoading) {
    return <div>Loading admin status...</div>;
  }

  if (!adminStatus?.isAdmin) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p>You don't have permission to access the admin chat dashboard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
      <div className="col-span-4">
        <SessionList
          selectedSession={selectedSession}
          onSelectSession={setSelectedSession}
        />
      </div>

      <div className="col-span-8 flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Customer Service Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-8rem)]">
            <MessageList sessionId={selectedSession} />
            <MessageInput sessionId={selectedSession} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
