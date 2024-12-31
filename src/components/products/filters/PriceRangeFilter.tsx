import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface PriceRangeFilterProps {
  priceRange: number[];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  isMobile?: boolean;
}

export const PriceRangeFilter = ({
  priceRange,
  setPriceRange,
  isMobile = false,
}: PriceRangeFilterProps) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localPriceRange[0] !== priceRange[0] || localPriceRange[1] !== priceRange[1]) {
        setPriceRange([localPriceRange[0], localPriceRange[1]] as [number, number]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localPriceRange, setPriceRange, priceRange]);

  const content = (
    <>
      <Slider
        defaultValue={[localPriceRange[0], localPriceRange[1]]}
        value={[localPriceRange[0], localPriceRange[1]]}
        max={1000}
        step={1}
        minStepsBetweenThumbs={1}
        onValueChange={(values) => {
          setLocalPriceRange([values[0], values[1]]);
        }}
        className="w-full"
      />
      <div className="flex justify-between text-sm mt-2">
        <span>${localPriceRange[0]}</span>
        <span>${localPriceRange[1]}</span>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="px-4 py-6">
        <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
        {content}
      </div>
    );
  }

  return (
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
            {content}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};