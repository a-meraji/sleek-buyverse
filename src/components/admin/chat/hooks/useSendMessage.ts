import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const useSendMessage = (sessionId: string | null) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    if (!content.trim() || !sessionId) return;

    setLoading(true);
    
    try {
      // Log before getting session
      console.log('Attempting to get current session...');
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Log raw session data and response
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
      console.log(`getting sender_id: ${session.user.id}`);

      // Create message data
      const messageData = {
        session_id: sessionId,
        content: content.trim(),
        sender_id: session.user.id,
      };

      // Log before sending message
      console.log('Sending message:', {
        session_id: sessionId,
        content: content.trim()
      });

      // Log the complete message data before sending
      console.log('Sending message with complete data:', messageData);

      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert(messageData);

      if (insertError) {
        console.error('Error sending message:', insertError);
        throw new Error('Failed to send message');
      }

      console.log('Message sent successfully with sender_id:', session.user.id);
      
      queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', sessionId] });
      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading
  };
};