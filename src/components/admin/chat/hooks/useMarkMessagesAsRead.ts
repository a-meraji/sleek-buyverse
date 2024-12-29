import { supabase } from "@/integrations/supabase/client";

export const useMarkMessagesAsRead = () => {
  const markMessagesAsRead = async (messages: any[], sessionId: string) => {
    // Find unread user messages
    const unreadUserMessages = messages.filter(
      msg => !msg.is_read && msg.sender_id !== null
    );

    console.log('Unread user messages:', unreadUserMessages);

    if (unreadUserMessages.length > 0) {
      const unreadIds = unreadUserMessages.map(msg => msg.id);
      console.log('Marking messages as read with IDs:', unreadIds);

      // Update messages as read - Adding session_id to ensure we update the correct messages
      const { data: updateResult, error: updateError } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .in('id', unreadIds)
        .eq('session_id', sessionId) // Add this condition
        .select();

      console.log('Update result:', updateResult);

      if (updateError) {
        console.error('Error marking messages as read:', updateError);
        return messages;
      }

      // Return updated messages with is_read set to true for the updated messages
      return messages.map(msg => 
        unreadIds.includes(msg.id) ? { ...msg, is_read: true } : msg
      );
    }

    return messages;
  };

  return { markMessagesAsRead };
};