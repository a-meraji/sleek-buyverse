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
  const [searchQueries, setSearchQueries] = useState({
    name: "",
    phone: "",
    address: "",
    postalCode: "",
  });

  const { data: profiles, isLoading, error } = useProfiles({ searchQueries });

  const handleSearch = debounce((field: string, value: string) => {
    setSearchQueries((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, 300);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;
  if (!profiles?.length) return <div>No users found</div>;

  console.log("Rendering profiles:", profiles);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search by name..."
          onChange={(e) => handleSearch("name", e.target.value)}
          className="w-full"
        />
        <Input
          placeholder="Search by phone..."
          onChange={(e) => handleSearch("phone", e.target.value)}
          className="w-full"
        />
        <Input
          placeholder="Search by address..."
          onChange={(e) => handleSearch("address", e.target.value)}
          className="w-full"
        />
        <Input
          placeholder="Search by postal code..."
          onChange={(e) => handleSearch("postalCode", e.target.value)}
          className="w-full"
        />
      </div>
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