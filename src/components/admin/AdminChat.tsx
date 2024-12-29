import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SessionList } from "./chat/SessionList";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";

export const AdminChat = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Fetch admin status
  const { data: isAdmin } = useQuery({
    queryKey: ['admin-status'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('isAdmin')
        .eq('id', session.user.id)
        .single();

      return profile?.isAdmin || false;
    },
  });

  if (!isAdmin) {
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