import { useAuth } from "@/contexts/auth/AuthContext";

export const useAuthState = () => {
  const { user, isLoading } = useAuth();

  return {
    isInitialized: !isLoading,
    isAuthenticated: !!user,
    userId: user?.id,
  };
};