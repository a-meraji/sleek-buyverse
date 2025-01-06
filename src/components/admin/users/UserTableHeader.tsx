import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UserTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Created At</TableHead>
      </TableRow>
    </TableHeader>
  );
}