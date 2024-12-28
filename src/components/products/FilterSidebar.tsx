import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="hidden lg:block space-y-6">
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider
          defaultValue={priceRange}
          max={1000}
          step={1}
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between text-sm mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {categories && categories.length > 0 && (
        <div>
          <h3 className="font-medium mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-desktop-${category}`}
                  checked={selectedCategory === category}
                  onCheckedChange={() => 
                    setSelectedCategory(selectedCategory === category ? null : category)
                  }
                />
                <label
                  htmlFor={`category-desktop-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};