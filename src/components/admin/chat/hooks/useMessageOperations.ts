import { supabase } from "@/integrations/supabase/client";
import { chatLogger } from "../utils/chatLogger";

interface MessageData {
  session_id: string;
  content: string;
  sender_id: string;
}

export const useMessageOperations = () => {
  const sendMessageToSupabase = async (messageData: MessageData) => {
    chatLogger.info('Attempting to send message with sender_id', {
      sender_id: messageData.sender_id,
      session_id: messageData.session_id,
      content: messageData.content
    });

    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert(messageData);

    if (insertError) {
      chatLogger.error('Error sending message', insertError);
      throw new Error('Failed to send message');
    }

    chatLogger.success('Message sent successfully');
    return true;
  };

  return { sendMessageToSupabase };
};