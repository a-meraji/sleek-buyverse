import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("useAdminCheck: Checking admin status for", userId);
      const { data, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("useAdminCheck: Admin check error:", error);
        return false;
      }
      console.log("useAdminCheck: Admin check result:", data);
      return !!data;
    } catch (error) {
      console.error("useAdminCheck: Admin check unexpected error:", error);
      return false;
    }
  };

  return { checkAdminStatus };
};