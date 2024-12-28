import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface MobileFiltersProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[] | undefined;
}

export const MobileFilters = ({
  open,
  setOpen,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
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
            <div className="px-4 py-6">
              <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
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
              <div className="px-4 py-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`category-mobile-${category}`}
                        name="category"
                        value={category}
                        type="checkbox"
                        checked={selectedCategory === category}
                        onChange={(e) => 
                          setSelectedCategory(e.target.checked ? category : null)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor={`category-mobile-${category}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};