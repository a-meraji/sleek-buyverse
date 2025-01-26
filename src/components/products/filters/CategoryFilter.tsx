import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categories: string[] | undefined;
  isMobile?: boolean;
}

export const CategoryFilter = ({
  selectedCategories,
  setSelectedCategories,
  categories,
  isMobile = false,
}: CategoryFilterProps) => {
  if (!categories || categories.length === 0) return null;

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const content = (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category} className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id={`category-${isMobile ? 'mobile-' : ''}${category}`}
              name="category"
              value={category}
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={(e) => handleCategoryChange(category, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor={`category-${isMobile ? 'mobile-' : ''}${category}`}
              className="ml-3 text-sm text-gray-600"
            >
              {category}
            </label>
          </div>
          <Badge variant="secondary" className="text-xs">
            {categories.filter(c => c === category).length}
          </Badge>
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