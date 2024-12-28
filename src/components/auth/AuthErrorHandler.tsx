import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthErrorHandlerProps {
  onError: (error: AuthError | null) => void;
}

export const useAuthErrorHandler = () => {
  const { toast } = useToast();

  const handleAuthError = (error: AuthError | null) => {
    console.error("Auth error details:", {
      message: error?.message,
      status: error?.status,
      name: error?.name,
    });
    
    if (!error) return;

    // Network or connection errors
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Please check your internet connection and try again.",
      });
      return;
    }

    // Rate limiting errors
    if (error.status === 429) {
      toast({
        variant: "destructive",
        title: "Too Many Attempts",
        description: "Please wait a moment before trying again.",
      });
      return;
    }

    // Invalid credentials (status 400)
    if (
      error.message.includes("Invalid login credentials") || 
      error.message.includes("invalid_credentials") ||
      (error.status === 400 && error.message.includes("failed to call url"))
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "The email or password you entered is incorrect. Please try again.",
      });
      return;
    }

    // Email not verified (status 400)
    if (error.message.includes("Email not confirmed")) {
      toast({
        variant: "destructive",
        title: "Email Not Verified",
        description: "Please check your email and verify your account before signing in.",
      });
      return;
    }

    // Account already exists (status 400)
    if (error.message.includes("User already registered")) {
      toast({
        variant: "destructive",
        title: "Account Already Exists",
        description: "An account with this email already exists. Please sign in instead.",
      });
      return;
    }

    // Invalid email format (status 400)
    if (error.message.includes("Invalid email")) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    // Password requirements not met (status 400)
    if (error.message.includes("Password should be")) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    // Account not found (status 400/404)
    if (error.message.includes("User not found")) {
      toast({
        variant: "destructive",
        title: "Account Not Found",
        description: "No account exists with this email address. Please sign up instead.",
      });
      return;
    }

    // Server errors (status 500+)
    if (error.status && error.status >= 500) {
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "We're experiencing technical difficulties. Please try again later.",
      });
      return;
    }

    // OAuth provider errors
    if (error.message.includes("Provider not supported") || error.message.includes("oauth")) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "There was a problem with the authentication provider. Please try again.",
      });
      return;
    }

    // Session expired or invalid
    if (error.message.includes("session")) {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Your session has expired. Please sign in again.",
      });
      return;
    }

    // Fallback for unexpected errors
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: "An unexpected error occurred. Please try again.",
    });
  };

  return handleAuthError;
};