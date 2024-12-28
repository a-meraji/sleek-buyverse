import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface ProductsHeaderProps {
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export const ProductsHeader = ({ setSortOrder }: ProductsHeaderProps) => {
  const sortOptions = [
    { name: "Price: Low to High", value: "asc" },
    { name: "Price: High to Low", value: "desc" },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">All Products</h1>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort by <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortOrder(option.value as 'asc' | 'desc')}
              >
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};