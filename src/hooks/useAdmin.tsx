import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useAdmin() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      console.log("Checking admin status...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found");
        toast({
          title: "Unauthorized",
          description: "You must be logged in to access this feature",
          variant: "destructive",
        });
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
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this feature",
          variant: "destructive",
        });
        return { isAdmin: false, role: null };
      }

      console.log("Admin status:", adminUser);
      
      const isAdmin = adminUser?.role === "admin" || adminUser?.role === "super_admin";
      
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "Admin privileges required",
          variant: "destructive",
        });
      }
      
      return {
        isAdmin,
        role: adminUser?.role
      };
    },
    retry: false
  });
}