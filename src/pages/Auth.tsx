import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { AuthError, AuthChangeEvent } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthError = (error: AuthError | null) => {
    console.error("Auth error:", error);
    
    if (!error) return;

    // Missing email error
    if (error.message.includes("missing email")) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address.",
      });
      return;
    }

    // Invalid credentials error
    if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "The email or password you entered is incorrect.",
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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        handleAuthError(error);
        return;
      }

      if (session) {
        console.log("User already logged in:", session.user);
        navigate("/");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in successfully:", session?.user);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }

      if (event === "USER_UPDATED") {
        console.log("User profile updated");
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }

      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery requested");
        toast({
          title: "Password Recovery",
          description: "Check your email for password reset instructions.",
        });
      }

      // Handle errors from specific auth events
      if (event === "TOKEN_REFRESHED" && !session) {
        const error = session as unknown as AuthError;
        if (error?.message) {
          handleAuthError(error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8">Welcome</h1>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground mb-4">
              Please enter your email and password to continue.
            </p>
            <SupabaseAuth 
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(var(--primary))',
                      brandAccent: 'rgb(var(--primary))',
                    },
                  },
                },
              }}
              providers={[]}
              redirectTo={`${window.location.origin}/`}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;