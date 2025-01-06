import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { UserTableHeader } from "./users/UserTableHeader";
import { UserTableRow } from "./users/UserTableRow";
import { useProfiles } from "./users/useProfiles";

export function AdminUsers() {
  const { data: profiles, isLoading, error } = useProfiles();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;
  if (!profiles?.length) return <div>No users found</div>;

  console.log("Rendering profiles:", profiles);

  return (
    <Table>
      <UserTableHeader />
      <TableBody>
        {profiles.map((profile) => (
          <UserTableRow key={profile.id} user={profile} />
        ))}
      </TableBody>
    </Table>
  );
}