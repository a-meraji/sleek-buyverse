import { useAuthState } from "./useAuthState";
import { useProfileQuery } from "./useProfileQuery";

export const useProfileData = () => {
  const authState = useAuthState();
  const { data: profile, isLoading, error } = useProfileQuery(authState.userId);

  return {
    profile,
    isLoading,
    error,
    isAuthenticated: authState.isAuthenticated,
    userId: authState.userId,
  };
};