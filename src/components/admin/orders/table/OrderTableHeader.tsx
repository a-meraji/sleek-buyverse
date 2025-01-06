import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function OrderTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Total Amount</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Order Items</TableHead>
        <TableHead className="w-[50px]">Details</TableHead>
      </TableRow>
    </TableHeader>
  );
}