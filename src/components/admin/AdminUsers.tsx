import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type AdminUser = {
  id: string;
  role: string | null;
  created_at: string;
  email: string | null;
  last_sign_in_at: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
};

type ProfileData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

type AuthUser = {
  id: string;
  email?: string;
  last_sign_in_at?: string;
}

export function AdminUsers() {
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching admin users...");
      
      // First get admin users
      const { data: adminUsersData, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (adminError) {
        console.error("Error fetching admin users:", adminError);
        throw adminError;
      }

      // Get profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Get user emails from auth metadata
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.error("Error fetching auth users:", authError);
        throw authError;
      }

      // Map and combine the data
      const enrichedUsers = adminUsersData.map((adminUser) => {
        const authUser = (authData.users as AuthUser[]).find((u) => u.id === adminUser.id);
        const profile = profilesData.find((p) => p.id === adminUser.id);
        
        return {
          ...adminUser,
          email: authUser?.email || null,
          last_sign_in_at: authUser?.last_sign_in_at || null,
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null,
          phone: profile?.phone || null,
        };
      });

      console.log("Enriched admin users:", enrichedUsers);
      return enrichedUsers as AdminUser[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Last Sign In</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adminUsers?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.first_name || user.last_name
                ? `${user.first_name || ""} ${user.last_name || ""}`
                : "N/A"}
            </TableCell>
            <TableCell>{user.email || "N/A"}</TableCell>
            <TableCell>{user.phone || "N/A"}</TableCell>
            <TableCell className="capitalize">{user.role || "user"}</TableCell>
            <TableCell>
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleDateString()
                : "Never"}
            </TableCell>
            <TableCell>
              {new Date(user.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}