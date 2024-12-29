import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface MessageInputProps {
  sessionId: string | null;
}

export const MessageInput = ({ sessionId }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    setLoading(true);
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      toast({
        title: "Error",
        description: "You must be signed in to send messages.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Create message data with the sender_id from session
    const messageData = {
      session_id: sessionId,
      content: newMessage.trim(),
      sender_id: session.user.id,
    };

    // Log the complete message data before sending
    console.log('Sending message with complete data:', messageData);

    // Single insert operation
    const { error } = await supabase
      .from('chat_messages')
      .insert(messageData);

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
    queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', sessionId] });
  };

  return (
    <form onSubmit={sendMessage} className="flex gap-2">
      <Input
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        disabled={loading || !sessionId}
      />
      <Button type="submit" disabled={loading || !sessionId}>
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </form>
  );
};