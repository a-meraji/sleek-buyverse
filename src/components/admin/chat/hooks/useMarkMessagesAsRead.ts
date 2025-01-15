import { supabase } from "@/integrations/supabase/client";

export const useMarkMessagesAsRead = () => {
  const markMessagesAsRead = async (messages: any[], sessionId: string) => {
    // Get current user id
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      console.log('No current user found');
      return messages;
    }

    // Get admin status
    const { data: isAdminData } = await supabase.rpc('is_admin', {
      user_id: currentUserId
    });
    const isAdmin = isAdminData;

    console.log('Current user is admin:', isAdmin);

    // Find unread messages that should be marked as read based on user role
    const unreadMessages = messages.filter(msg => {
      if (isAdmin) {
        // Admin should mark messages from users as read
        return !msg.is_read && msg.sender_id !== null && msg.sender_id !== currentUserId;
      } else {
        // Regular user should mark messages from admins as read
        return !msg.is_read && msg.sender_id !== currentUserId;
      }
    });

    console.log('Messages to mark as read:', unreadMessages);

    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map(msg => msg.id);
      
      // Update messages as read
      const { data: updateResult, error: updateError } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .in('id', unreadIds)
        .select();

      if (updateError) {
        console.error('Error marking messages as read:', updateError);
        return messages;
      }

      console.log('Messages marked as read:', updateResult);

      // Return updated messages with is_read set to true for the updated messages
      return messages.map(msg => 
        unreadIds.includes(msg.id) ? { ...msg, is_read: true } : msg
      );
    }

    return messages;
  };

  return { markMessagesAsRead };
};