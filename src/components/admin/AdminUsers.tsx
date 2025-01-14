import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { UserTableHeader } from "./users/UserTableHeader";
import { UserTableRow } from "./users/UserTableRow";
import { useProfiles } from "./users/useProfiles";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AdminUsers() {
  const [inputValues, setInputValues] = useState({
    name: "",
    phone: "",
    address: "",
    postalCode: "",
  });

  const [searchQueries, setSearchQueries] = useState({
    name: "",
    phone: "",
    address: "",
    postalCode: "",
  });

  const { data: profiles, isLoading, error } = useProfiles({ searchQueries });

  const handleInputChange = (field: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    setSearchQueries(inputValues);
  };

  const clearSearch = (field: string) => {
    setInputValues((prev) => ({
      ...prev,
      [field]: "",
    }));
    setSearchQueries((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const clearAllSearches = () => {
    setInputValues({
      name: "",
      phone: "",
      address: "",
      postalCode: "",
    });
    setSearchQueries({
      name: "",
      phone: "",
      address: "",
      postalCode: "",
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;
  if (!profiles?.length) return <div>No users found</div>;

  const hasActiveFilters = Object.values(searchQueries).some(Boolean);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name..."
            value={inputValues.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Search by phone..."
            value={inputValues.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Search by address..."
            value={inputValues.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Search by postal code..."
            value={inputValues.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={handleSearch} className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearAllSearches} className="text-muted-foreground">
              Clear all filters
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(searchQueries).map(([key, value]) => {
              if (!value) return null;
              return (
                <Badge key={key} variant="secondary" className="gap-2">
                  {key}: {value}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => clearSearch(key)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
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