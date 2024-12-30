import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthForm = () => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <p className="text-sm text-muted-foreground mb-4">
        Please enter your details to continue.
      </p>
      <Auth 
        supabaseClient={supabase}
        view="sign_in"
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
        providers={["google"]}
        redirectTo={`${window.location.origin}/`}
        showLinks={true}
        additionalData={{
          first_name: true,
          last_name: true,
        }}
        socialLayout="horizontal"
      />
    </div>
  );
};