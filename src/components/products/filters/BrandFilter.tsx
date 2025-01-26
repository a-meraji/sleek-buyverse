import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BrandFilterProps {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  brands: string[] | undefined;
  isMobile?: boolean;
}

export const BrandFilter = ({
  selectedBrands,
  setSelectedBrands,
  brands,
  isMobile = false,
}: BrandFilterProps) => {
  if (!brands || brands.length === 0) return null;

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const content = (
    <div className="space-y-4">
      {brands.map((brand) => (
        <div key={brand} className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id={`brand-${isMobile ? 'mobile-' : ''}${brand}`}
              name="brand"
              value={brand}
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={(e) => handleBrandChange(brand, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor={`brand-${isMobile ? 'mobile-' : ''}${brand}`}
              className="ml-3 text-sm text-gray-600"
            >
              {brand}
            </label>
          </div>
          <Badge variant="secondary" className="text-xs">
            {brands.filter(b => b === brand).length}
          </Badge>
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div className="px-4 py-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Brands</h3>
        {content}
      </div>
    );
  }

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Brands</span>
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