export interface ChatSession {
  id: string;
  user_id: string | null;
  admin_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  user_email: string | null;
  unread_count: number;
}

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}