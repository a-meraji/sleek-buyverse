import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthForm = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-card p-6 rounded-lg shadow-sm">
      <p className="text-sm text-muted-foreground mb-4">
        Please enter your details to continue.
      </p>
      <Auth 
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          style: {
            button: { 
              background: '#33C3F0',
              color: 'white',
              '&:hover': {
                background: '#0FA0CE'
              }
            },
            anchor: { 
              color: '#1EAEDB',
              '&:hover': {
                color: '#0FA0CE'
              }
            },
            container: { 
              width: '100%'
            },
            input: { 
              background: 'white',
              borderColor: '#D3E4FD'
            },
            label: {
              color: '#4A5568'
            }
          },
        }}
        providers={["google"]}
        redirectTo={`${window.location.origin}/`}
        showLinks={true}
        localization={{
          variables: {
            sign_up: {
              email_label: "Email",
              password_label: "Password",
              email_input_placeholder: "Your email address",
              password_input_placeholder: "Your password",
              button_label: "Sign up",
              loading_button_label: "Signing up ...",
              social_provider_text: "Sign in with {{provider}}",
              link_text: "Don't have an account? Sign up",
              confirmation_text: "Check your email for the confirmation link",
            },
          },
        }}
        additionalData={[
          {
            key: 'first_name',
            label: 'First Name',
            type: 'text',
            required: true,
          },
          {
            key: 'last_name',
            label: 'Last Name',
            type: 'text',
            required: true,
          },
        ]}
        socialLayout="horizontal"
      />
    </div>
  );
};