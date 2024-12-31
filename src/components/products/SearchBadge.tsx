import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchBadgeProps {
  searchQuery: string;
  selectedCategories: string[];
  onClear: () => void;
  onClearCategory?: (category: string) => void;
}

export const SearchBadge = ({ 
  searchQuery, 
  selectedCategories, 
  onClear,
  onClearCategory 
}: SearchBadgeProps) => {
  if (!searchQuery && selectedCategories.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-4 flex-wrap">
      {searchQuery && (
        <Badge variant="secondary" className="text-sm flex items-center">
          Searching "{searchQuery}"
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
            onClick={onClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {selectedCategories.map((category) => (
        <Badge key={category} variant="outline" className="text-sm flex items-center">
          {category}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
            onClick={() => onClearCategory?.(category)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};