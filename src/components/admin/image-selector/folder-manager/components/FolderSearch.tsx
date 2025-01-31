import { Input } from "@/components/ui/input";

interface FolderSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function FolderSearch({ searchQuery, onSearchChange }: FolderSearchProps) {
  return (
    <Input
      type="text"
      placeholder="Search folders..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full"
    />
  );
}