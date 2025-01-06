import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderTableHeaderProps {
  sortDirection: "asc" | "desc";
  onSortChange: (direction: "asc" | "desc") => void;
}

export function OrderTableHeader({ sortDirection, onSortChange }: OrderTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Total Amount</TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            Date
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                onSortChange(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </TableHead>
        <TableHead>Order Items</TableHead>
        <TableHead className="w-[50px]">Details</TableHead>
      </TableRow>
    </TableHeader>
  );
}