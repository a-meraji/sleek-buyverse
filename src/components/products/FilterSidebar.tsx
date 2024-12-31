import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { Dispatch, SetStateAction } from "react";

interface FilterSidebarProps {
  priceRange: number[];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[] | undefined;
}

export const FilterSidebar = ({
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  categories,
}: FilterSidebarProps) => {
  return (
    <form className="hidden lg:block">
      <div className="space-y-6">
        <PriceRangeFilter 
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      </div>
    </form>
  );
};