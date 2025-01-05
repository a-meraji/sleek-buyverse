import { Input } from "@/components/ui/input";

interface ProductSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ProductSearchBar({ searchTerm, onSearchChange }: ProductSearchBarProps) {
  return (
    <Input
      placeholder="Search products..."
      className="max-w-sm"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}