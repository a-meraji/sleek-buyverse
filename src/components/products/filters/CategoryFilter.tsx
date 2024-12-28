import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[] | undefined;
  isMobile?: boolean;
}

export const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  isMobile = false,
}: CategoryFilterProps) => {
  if (!categories || categories.length === 0) return null;

  const content = (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category} className="flex items-center">
          <input
            id={`category-${isMobile ? 'mobile-' : ''}${category}`}
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
            htmlFor={`category-${isMobile ? 'mobile-' : ''}${category}`}
            className="ml-3 text-sm text-gray-600"
          >
            {category}
          </label>
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div className="px-4 py-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
        {content}
      </div>
    );
  }

  return (
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
            {content}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};