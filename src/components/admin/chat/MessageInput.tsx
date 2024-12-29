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
    
    try {
      // Log before getting session
      console.log('Attempting to get current session...');
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Log raw session data and response
      console.log('Raw session data:', session);
      console.log(`response of retrieving sender_id: ${JSON.stringify({ session, error: sessionError })}`);
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error');
      }

      if (!session) {
        console.error('No session found');
        throw new Error('No session found');
      }

      if (!session.user) {
        console.error('No user object in session');
        throw new Error('No user object found in session');
      }

      if (!session.user.id) {
        console.error('No user ID in session user object');
        throw new Error('No user ID found');
      }

      // Log the sender_id from session
      console.log('sender_id retrieved successfully:', session.user.id);
      console.log(`getting sender_id: ${session.user.id}`);

      // Create message data with the sender_id from session
      const messageData = {
        session_id: sessionId,
        content: newMessage.trim(),
        sender_id: session.user.id,
      };

      // Log the complete message data before sending
      console.log('Sending message with complete data:', messageData);

      // Single insert operation
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert(messageData);

      if (insertError) {
        console.error('Error sending message:', insertError);
        throw new Error('Failed to send message');
      }

      console.log('Message sent successfully with sender_id:', session.user.id);

      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', sessionId] });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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