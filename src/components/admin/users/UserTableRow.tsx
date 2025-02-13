import { TableCell, TableRow } from "@/components/ui/table";
import { ProfileData } from "./types";

interface UserTableRowProps {
  user: ProfileData;
}

export function UserTableRow({ user }: UserTableRowProps) {
  const formatAddress = (user: ProfileData) => {
    const parts = [
      user.street_address,
      user.city,
      user.state,
      user.postal_code
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  return (
    <TableRow>
      <TableCell>
        {user.first_name || user.last_name
          ? `${user.first_name || ""} ${user.last_name || ""}`
          : "N/A"}
      </TableCell>
      <TableCell>{user.phone || "N/A"}</TableCell>
      <TableCell>{formatAddress(user)}</TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
}