import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { UserTableHeader } from "./users/UserTableHeader";
import { UserTableRow } from "./users/UserTableRow";
import { useProfiles } from "./users/useProfiles";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { debounce } from "lodash";

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: profiles, isLoading, error } = useProfiles({ searchQuery });

  const handleSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;
  if (!profiles?.length) return <div>No users found</div>;

  console.log("Rendering profiles:", profiles);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name, email, phone, or postal code..."
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-md"
      />
      <Table>
        <UserTableHeader />
        <TableBody>
          {profiles.map((profile) => (
            <UserTableRow key={profile.id} user={profile} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}