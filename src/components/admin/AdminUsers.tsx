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

export function AdminUsers() {
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching admin users with profiles...");
      const { data: users, error } = await supabase
        .from("admin_users")
        .select(`
          id,
          role,
          created_at,
          profiles (
            first_name,
            last_name,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admin users:", error);
        throw error;
      }

      // Get user emails from auth metadata
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.error("Error fetching auth users:", authError);
        throw authError;
      }

      // Map and combine the data
      const enrichedUsers = users.map((user) => {
        const authUser = authData.users.find((u) => u.id === user.id);
        return {
          ...user,
          email: authUser?.email || null,
          last_sign_in_at: authUser?.last_sign_in_at || null,
          first_name: user.profiles?.first_name || null,
          last_name: user.profiles?.last_name || null,
          phone: user.profiles?.phone || null,
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