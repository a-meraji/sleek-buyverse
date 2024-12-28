import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

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
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  
  // Update local state when props change
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  // Debounced update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localPriceRange[0] !== priceRange[0] || localPriceRange[1] !== priceRange[1]) {
        setPriceRange(localPriceRange);
      }
    }, 500); // Wait 500ms after the last change

    return () => clearTimeout(timer);
  }, [localPriceRange, setPriceRange, priceRange]);

  return (
    <form className="hidden lg:block">
      <div className="space-y-6">
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Price Range</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel className="pt-6">
                <Slider
                  defaultValue={localPriceRange}
                  value={localPriceRange}
                  max={1000}
                  step={1}
                  minStepsBetweenThumbs={1}
                  onValueChange={setLocalPriceRange}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>${localPriceRange[0]}</span>
                  <span>${localPriceRange[1]}</span>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {categories && categories.length > 0 && (
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Categories</span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel className="pt-6">
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
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
                          htmlFor={`category-${category}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        )}
      </div>
    </form>
  );
};