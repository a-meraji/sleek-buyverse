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
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)] bg-blue-500">
      <div className="col-span-4 overflow-hidden">
        <SessionList
          selectedSession={selectedSession}
          onSelectSession={setSelectedSession}
        />
      </div>

      <div className="col-span-8">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle>Customer Service Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto px-6 h-[calc(100vh-21rem)] bg-orange-400">
              <MessageList sessionId={selectedSession} />
            </div>
            <div className="flex-none p-6 pt-4 border-t bg-background fixed bottom-0 right-0 w-full">
              <MessageInput sessionId={selectedSession} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
