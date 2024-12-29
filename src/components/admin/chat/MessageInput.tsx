import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface MessageInputProps {
  sessionId: string | null;
}

export const MessageInput = ({ sessionId }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    setLoading(true);
    console.log('Sending message:', {
      session_id: sessionId,
      content: newMessage.trim(),
      sender_id: null,
    });

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
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