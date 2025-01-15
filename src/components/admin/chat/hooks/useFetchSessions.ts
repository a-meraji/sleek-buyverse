import { supabase } from "@/integrations/supabase/client";
import { ChatSession } from "../types/chat";
import { useUserProfiles } from "./useUserProfiles";

export const useFetchSessions = () => {
  const { fetchUserProfile } = useUserProfiles();

  const fetchUnreadCount = async (sessionId: string, currentUserId: string, isAdmin: boolean) => {
    console.log('Fetching unread count for session:', sessionId);
    
    // First get the admin user IDs - same as chat tab
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('id');

    if (adminError) {
      console.error('Error fetching admin users:', adminError);
      return 0;
    }

    const adminIds = adminUsers.map(admin => admin.id);
    console.log('Admin IDs:', adminIds);

    // Match the exact query structure from useUnreadAdminMessages
    const { data: messages, error: countError } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('session_id', sessionId)
      .eq('is_read', false);

    if (countError) {
      console.error('Error counting unread messages:', countError);
      return 0;
    }

    // Filter messages based on sender - match chat tab logic
    const unreadCount = messages?.filter(msg => {
      if (isAdmin) {
        // For admins, count messages from non-admin users
        return !adminIds.includes(msg.sender_id);
      } else {
        // For users, count messages from admins
        return adminIds.includes(msg.sender_id);
      }
    }).length || 0;

    console.log(`Unread count for session ${sessionId}:`, unreadCount);
    return unreadCount;
  };

  const fetchSessions = async () => {
    console.log('Fetching chat sessions...');
    
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      console.error('No current user found');
      return [];
    }

    const { data: isAdminData } = await supabase.rpc('is_admin', {
      user_id: currentUserId
    });
    const isAdmin = isAdminData;
    console.log('Current user is admin:', isAdmin);

    const { data: chatSessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('status', 'active')
      .order('last_message_at', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      throw sessionsError;
    }

    const sessionsWithProfiles = await Promise.all(
      chatSessions.map(async (session) => {
        const profile = session.user_id ? await fetchUserProfile(session.user_id) : null;
        const unreadCount = await fetchUnreadCount(session.id, currentUserId, isAdmin);

        return {
          ...session,
          user_email: profile?.email || 'Anonymous',
          unread_count: unreadCount
        };
      })
    );

    console.log('Sessions with profiles and unread counts:', sessionsWithProfiles);
    return sessionsWithProfiles;
  };

  return { fetchSessions };
};