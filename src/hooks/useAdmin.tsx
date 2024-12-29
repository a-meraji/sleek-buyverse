import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  return useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      console.log("Checking admin status...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found");
        return { isAdmin: false, role: null };
      }

      console.log("Checking admin status for user:", session.user.id);
      
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error checking admin status:", error);
        return { isAdmin: false, role: null };
      }

      console.log("Admin status:", adminUser);
      
      return {
        isAdmin: adminUser?.role === "admin" || adminUser?.role === "super_admin",
        role: adminUser?.role
      };
    },
  });
}