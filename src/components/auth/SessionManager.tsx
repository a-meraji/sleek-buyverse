import { AuthError } from "@supabase/supabase-js";
import { useSessionInit } from "@/hooks/useSessionInit";
import { useAuthStateChange } from "@/hooks/useAuthStateChange";

interface SessionManagerProps {
  onError: (error: AuthError | null) => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ onError }) => {
  useSessionInit(onError);
  useAuthStateChange();

  return null;
};