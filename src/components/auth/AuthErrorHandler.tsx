import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthErrorHandlerProps {
  onError: (error: AuthError | null) => void;
}

export const useAuthErrorHandler = () => {
  const { toast } = useToast();

  const handleAuthError = (error: AuthError | null) => {
    console.error("Auth error:", error);
    
    if (!error) return;

    // Check for invalid credentials error - both message formats
    if (
      error.message.includes("Invalid login credentials") || 
      error.message.includes("invalid_credentials") ||
      (error.status === 400 && error.error_type === "http_client_error")
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "The email or password you entered is incorrect. Please try again.",
      });
      return;
    }

    // Missing email error
    if (error.message.includes("missing email")) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address.",
      });
      return;
    }

    // User already exists error
    if (error.message.includes("User already registered") || error.message.includes("user_already_exists")) {
      toast({
        variant: "destructive",
        title: "Account Already Exists",
        description: "An account with this email already exists. Please sign in instead.",
      });
      return;
    }

    // Password-related errors
    if (error.message.includes("weak_password")) {
      toast({
        variant: "destructive",
        title: "Password Too Weak",
        description: "Password should be at least 6 characters long and contain a mix of characters.",
      });
      return;
    }

    // Email-related errors
    if (error.message.includes("User not found")) {
      toast({
        variant: "destructive",
        title: "Account Not Found",
        description: "No account exists with this email address.",
      });
      return;
    }

    if (error.message.includes("Email not confirmed")) {
      toast({
        variant: "destructive",
        title: "Email Not Verified",
        description: "Please check your email and verify your account.",
      });
      return;
    }

    // Rate limiting and other errors
    if (error.message.includes("Too many requests")) {
      toast({
        variant: "destructive",
        title: "Too Many Attempts",
        description: "Please wait a moment before trying again.",
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