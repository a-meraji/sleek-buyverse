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
  auth_user: {
    email: string;
    last_sign_in_at: string;
  } | null;
};

export function AdminUsers() {
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching admin users...");
      const { data: users, error } = await supabase
        .from("admin_users")
        .select(`
          id,
          role,
          created_at,
          auth_user:id (
            email,
            last_sign_in_at
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching admin users:", error);
        throw error;
      }

      console.log("Fetched admin users:", users);
      return users as AdminUser[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Last Sign In</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {adminUsers?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.auth_user?.email || "N/A"}</TableCell>
            <TableCell className="capitalize">{user.role || "user"}</TableCell>
            <TableCell>
              {user.auth_user?.last_sign_in_at
                ? new Date(user.auth_user.last_sign_in_at).toLocaleDateString()
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