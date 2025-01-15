import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusSelectorProps {
  selectedStatus: string | null;
  onStatusChange: (value: string | null) => void;
}

export function StatusSelector({ selectedStatus, onStatusChange }: StatusSelectorProps) {
  return (
    <Select
      value={selectedStatus || "all"}
      onValueChange={(value) => onStatusChange(value === "all" ? null : value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
}