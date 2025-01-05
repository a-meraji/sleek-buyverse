import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProductTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>SKU</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Variants</TableHead>
        <TableHead>Total Stock</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}