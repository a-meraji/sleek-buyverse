import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { BrandFilter } from "./filters/BrandFilter";
import { Dispatch, SetStateAction } from "react";

interface FilterSidebarProps {
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  categories?: string[];
  brands?: string[];
  className?: string;
}

export const FilterSidebar = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  categories,
  brands,
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
        <BrandFilter
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          brands={brands}
        />
      </div>
    </form>
  );
};