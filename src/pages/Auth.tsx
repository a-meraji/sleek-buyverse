import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/auth/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      console.log("Auth: Redirecting authenticated user to home");
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Welcome</h1>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : !user ? (
            <AuthForm />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Auth;