import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FolderSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FolderSearch({ searchQuery, onSearchChange }: FolderSearchProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search folders..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Search className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}