import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const AdminChat = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }

      setSessions(data);
      if (data.length > 0 && !selectedSession) {
        setSelectedSession(data[0].id);
      }
    };

    fetchSessions();

    // Subscribe to new sessions
    const channel = supabase
      .channel('chat-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession]);

  useEffect(() => {
    if (!selectedSession) return;

    // Subscribe to new messages
    const channel = supabase
      .channel('admin-chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${selectedSession}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', selectedSession)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data);
    };

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession) return;

    setLoading(true);
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: selectedSession,
        content: newMessage.trim(),
        sender_id: null, // null sender_id indicates admin message
      });

    setLoading(false);
    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage("");
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
      <div className="col-span-4 space-y-4">
        <h3 className="text-lg font-semibold">Active Chats</h3>
        <ScrollArea className="h-[calc(100vh-14rem)]">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`mb-2 cursor-pointer ${
                selectedSession === session.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedSession(session.id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-sm">
                  {session.profiles?.full_name || "Anonymous"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {session.profiles?.email || "No email"}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </div>

      <div className="col-span-8 flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              Chat with{" "}
              {sessions.find((s) => s.id === selectedSession)?.profiles
                ?.full_name || "Anonymous"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-8rem)]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender_id
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={sendMessage} className="flex gap-2 mt-4">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={loading || !selectedSession}
              />
              <Button type="submit" disabled={loading || !selectedSession}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};