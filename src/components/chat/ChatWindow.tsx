import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ChatWindowProps {
  open: boolean;
  onClose: () => void;
}

export const ChatWindow = ({ open, onClose }: ChatWindowProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize chat session
  useEffect(() => {
    const initializeChat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to chat with customer service.",
          variant: "destructive",
        });
        onClose();
        return;
      }

      const { data: existingSession, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching chat session:', fetchError);
        return;
      }

      if (existingSession) {
        console.log('Found existing chat session:', existingSession);
        setSessionId(existingSession.id);
      } else {
        console.log('Creating new chat session...');
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({ user_id: session.user.id })
          .select()
          .single();

        if (createError) {
          console.error('Error creating chat session:', createError);
          return;
        }
        console.log('Created new chat session:', newSession);
        setSessionId(newSession.id);
      }
    };

    if (open) {
      initializeChat();
    }
  }, [open, toast, onClose]);

  // Fetch messages periodically
  const { data: messages = [] } = useQuery({
    queryKey: ['chat-messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      return data;
    },
    enabled: !!sessionId,
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Error",
        description: "You must be signed in to send messages.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content: newMessage.trim(),
        sender_id: session.user.id,
      });

    setLoading(false);
    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    queryClient.invalidateQueries({ queryKey: ['chat-messages', sessionId] });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full p-0">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Customer Service</h2>
          </div>
          
          <div className="flex-1 overflow-hidden px-6">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender_id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="p-6 mt-auto border-t">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};