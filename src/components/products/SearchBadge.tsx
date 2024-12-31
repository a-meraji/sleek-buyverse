import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchBadgeProps {
  searchQuery: string;
  selectedCategory: string | null;
  onClear: () => void;
}

export const SearchBadge = ({ searchQuery, selectedCategory, onClear }: SearchBadgeProps) => {
  if (!searchQuery && !selectedCategory) return null;

  return (
    <div className="flex items-center gap-2 mt-4">
      <Badge variant="secondary" className="text-sm flex items-center">
        {searchQuery && `Searching "${searchQuery}"`}
        {selectedCategory && (searchQuery ? ` in ${selectedCategory}` : `Category: ${selectedCategory}`)}
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
          onClick={onClear}
        >
          <X className="h-3 w-3" />
        </Button>
      </Badge>
    </div>
  );
};