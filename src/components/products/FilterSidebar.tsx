import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { Dispatch, SetStateAction } from "react";

interface FilterSidebarProps {
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categories?: string[];
  className?: string;
}

export const FilterSidebar = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  categories,
  className,
}: FilterSidebarProps) => {
  return (
    <form className={`hidden lg:block ${className}`}>
      <div className="space-y-6">
        <PriceRangeFilter 
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        <CategoryFilter
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categories={categories}
        />
      </div>
    </form>
  );
};