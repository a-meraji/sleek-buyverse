import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { UserTableHeader } from "./users/UserTableHeader";
import { UserTableRow } from "./users/UserTableRow";
import { useProfiles } from "./users/useProfiles";

export function AdminUsers() {
  const { data: profiles, isLoading } = useProfiles();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <UserTableHeader />
      <TableBody>
        {profiles?.map((profile) => (
          <UserTableRow key={profile.id} user={profile} />
        ))}
      </TableBody>
    </Table>
  );
}