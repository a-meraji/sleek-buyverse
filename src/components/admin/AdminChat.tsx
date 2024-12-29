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
      <div className="col-span-4 overflow-hidden">
        <SessionList
          selectedSession={selectedSession}
          onSelectSession={setSelectedSession}
        />
      </div>

      <div className="col-span-8">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Customer Service Chat</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100vh-16rem)] flex flex-col p-0">
            <div className="flex-1 overflow-hidden px-6">
              <MessageList sessionId={selectedSession} />
            </div>
            <div className="p-6 pt-0">
              <MessageInput sessionId={selectedSession} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};