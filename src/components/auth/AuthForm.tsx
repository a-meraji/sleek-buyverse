import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export function AuthForm() {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          style: {
            button: {
              background: "#1d8757",
              color: "white",
              borderRadius: "9999px",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              lineHeight: "1.5rem",
              fontWeight: "500",
              transition: "background-color 0.2s",
            },
            anchor: {
              color: "#1d8757",
              textDecoration: "none",
              transition: "opacity 0.2s",
            },
          },
          className: {
            button: "hover:bg-[#1d8757]/90",
            anchor: "hover:opacity-80",
          },
        }}
        theme="default"
        providers={["google"]}
      />
    </div>
  );
}