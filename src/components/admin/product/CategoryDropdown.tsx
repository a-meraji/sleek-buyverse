import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryDropdownProps {
  value: string;
  categories: string[];
  onValueChange: (value: string) => void;
}

export function CategoryDropdown({
  value,
  categories,
  onValueChange,
}: CategoryDropdownProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {categories?.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
        <SelectItem value="new">
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add new category
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}