import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { Dispatch, SetStateAction } from "react";

interface MobileFiltersProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categories?: string[];
}

export const MobileFilters = ({
  open,
  setOpen,
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  categories,
}: MobileFiltersProps) => {
  return (
    <Dialog as="div" open={open} onClose={setOpen} className="relative z-40 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 z-40 flex">
        <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 border-t border-gray-200">
            <PriceRangeFilter 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              isMobile
            />
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={categories}
              isMobile
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};