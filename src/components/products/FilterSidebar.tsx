import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { CategoryFilter } from "./filters/CategoryFilter";

interface FilterSidebarProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
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