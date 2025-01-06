import { TableCell, TableRow } from "@/components/ui/table";
import { ProfileData } from "./types";

interface UserTableRowProps {
  user: ProfileData;
}

export function UserTableRow({ user }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        {user.first_name || user.last_name
          ? `${user.first_name || ""} ${user.last_name || ""}`
          : "N/A"}
      </TableCell>
      <TableCell>{user.phone || "N/A"}</TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
}