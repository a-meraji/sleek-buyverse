import { Navbar } from "@/components/Navbar";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthErrorHandler } from "@/components/auth/AuthErrorHandler";
import { SessionManager } from "@/components/auth/SessionManager";

const Auth = () => {
  const handleAuthError = useAuthErrorHandler();

  return (
    <div className="min-h-screen bg-background">
      <SessionManager onError={handleAuthError} />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8">Welcome</h1>
          <AuthForm />
        </div>
      </main>
    </div>
  );
};

export default Auth;