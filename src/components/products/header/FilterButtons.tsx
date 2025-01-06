import { Clock, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

interface FilterButtonsProps {
  handleFilterClick: (filter: string) => void;
}

export const FilterButtons = ({ handleFilterClick }: FilterButtonsProps) => {
  const [searchParams] = useSearchParams();
  const currentSort = searchParams.get('sort');
  const isDiscounted = searchParams.get('discount') === 'true';

  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFilterClick('newest')}
        className={cn(
          "gap-1 md:gap-2 text-xs md:text-sm",
          currentSort === 'newest' && "bg-primary text-white hover:bg-primary/90"
        )}
      >
        <Clock className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden md:inline">New Arrivals</span>
        <span className="md:hidden">New</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFilterClick('popular')}
        className={cn(
          "gap-1 md:gap-2 text-xs md:text-sm",
          currentSort === 'popular' && "bg-primary text-white hover:bg-primary/90"
        )}
      >
        <Star className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden md:inline">Popular</span>
        <span className="md:hidden">Popular</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFilterClick('discount')}
        className={cn(
          "gap-1 md:gap-2 text-xs md:text-sm",
          isDiscounted && "bg-primary text-white hover:bg-primary/90"
        )}
      >
        <Tag className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden md:inline">Special Offers</span>
        <span className="md:hidden">Offers</span>
      </Button>
    </div>
  );
};