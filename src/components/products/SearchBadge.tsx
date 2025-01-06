import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

interface SearchBadgeProps {
  searchQuery: string;
  selectedCategories: string[];
  onClear: () => void;
  onClearCategory: (category: string) => void;
}

export const SearchBadge = ({
  searchQuery,
  selectedCategories,
  onClear,
  onClearCategory,
}: SearchBadgeProps) => {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get('sort');
  const isDiscounted = searchParams.get('discount') === 'true';

  if (!searchQuery && !selectedCategories.length && !sort && !isDiscounted) {
    return null;
  }

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'newest':
        return 'New Arrivals';
      case 'popular':
        return 'Popular Products';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {(searchQuery || selectedCategories.length > 0 || sort || isDiscounted) && (
        <div className="text-sm text-gray-500">Filters:</div>
      )}
      
      {searchQuery && (
        <Badge variant="secondary" className="text-sm">
          Search: {searchQuery}
        </Badge>
      )}

      {selectedCategories.map((category) => (
        <Badge
          key={category}
          variant="secondary"
          className="flex items-center gap-1 text-sm"
        >
          {category}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={() => onClearCategory(category)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {sort && (
        <Badge variant="secondary" className="text-sm">
          {getFilterLabel(sort)}
        </Badge>
      )}

      {isDiscounted && (
        <Badge variant="secondary" className="text-sm">
          Special Offers
        </Badge>
      )}

      {(searchQuery || selectedCategories.length > 0 || sort || isDiscounted) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={onClear}
        >
          Clear all
        </Button>
      )}
    </div>
  );
};