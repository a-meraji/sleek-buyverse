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
        options={{
          emailRedirectTo: `${window.location.origin}/`,
          socialLayout: 'horizontal',
          additionalData: {
            first_name: true,
            last_name: true,
          },
        }}
      />
    </div>
  );
};