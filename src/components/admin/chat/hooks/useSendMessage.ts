import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useSessionUser } from "./useSessionUser";
import { useMessageOperations } from "./useMessageOperations";
import { chatLogger } from "../utils/chatLogger";

export const useSendMessage = (sessionId: string | null) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { getCurrentUser } = useSessionUser();
  const { sendMessageToSupabase } = useMessageOperations();

  const sendMessage = async (content: string) => {
    chatLogger.info('Attempting to send message', {
      session_id: sessionId,
      content: content
    });

    if (!content.trim() || !sessionId) {
      chatLogger.info('Cannot send message: content is empty or no session ID');
      return false;
    }

    setLoading(true);
    
    try {
      const user = await getCurrentUser();
      
      chatLogger.info('Got sender_id', user.id);
      
      await sendMessageToSupabase({
        session_id: sessionId,
        content: content.trim(),
        sender_id: user.id,
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', sessionId] });
      return true;
    } catch (error) {
      chatLogger.error('Error in sendMessage', error);
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