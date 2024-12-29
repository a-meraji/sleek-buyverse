import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface SessionListProps {
  selectedSession: string | null;
  onSelectSession: (sessionId: string) => void;
}

interface ChatSession {
  id: string;
  user_id: string | null;
  admin_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  user_details: {
    email: string | null;
  } | null;
  messages: { count: number }[];
}

export const SessionList = ({ selectedSession, onSelectSession }: SessionListProps) => {
  const { data: sessions = [], isError, error } = useQuery<ChatSession[]>({
    queryKey: ['chat-sessions'],
    queryFn: async () => {
      console.log('Fetching chat sessions...');
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          user_details:profiles(email),
          messages:chat_messages(count)
        `)
        .eq('status', 'active')
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        throw error;
      }

      console.log('Fetched sessions:', data);
      return data || [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  if (isError) {
    console.error('Query error:', error);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Active Chats ({sessions?.length || 0})
      </h3>
      <ScrollArea className="h-[calc(100vh-14rem)]">
        {sessions?.map((session) => (
          <Card
            key={session.id}
            className={`mb-2 cursor-pointer ${
              selectedSession === session.id ? "border-primary" : ""
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-sm">
                {session.user_details?.email || "Anonymous"}
              </CardTitle>
              <CardDescription className="text-xs">
                {new Date(session.last_message_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};