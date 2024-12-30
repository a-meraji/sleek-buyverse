import { Input } from "@/components/ui/input";

interface ProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearchBar({ value, onChange }: ProductSearchBarProps) {
  return (
    <Input
      placeholder="Search products..."
      className="max-w-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}