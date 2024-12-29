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

      // First, verify the messages exist
      const { data: verifyData, error: verifyError } = await supabase
        .from('chat_messages')
        .select('*')
        .in('id', unreadIds)
        .eq('session_id', sessionId);

      console.log('Verification data:', verifyData);
      
      if (verifyError) {
        console.error('Error verifying messages:', verifyError);
        return messages;
      }

      // Update messages as read
      const { data: updateResult, error: updateError } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .in('id', unreadIds)
        .eq('session_id', sessionId)
        .select();

      console.log('Update operation result:', updateResult);
      console.log('Update operation error:', updateError);

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