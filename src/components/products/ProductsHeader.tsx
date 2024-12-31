import { Menu } from "@headlessui/react";
import { ChevronDown, Filter, Grid } from "lucide-react";

interface ProductsHeaderProps {
  setSortOrder: (order: 'asc' | 'desc') => void;
  setMobileFiltersOpen: (open: boolean) => void;
  searchQuery: string;
}

export const ProductsHeader = ({ 
  setSortOrder, 
  setMobileFiltersOpen,
  searchQuery
}: ProductsHeaderProps) => {
  const sortOptions = [
    { name: "Price: Low to High", value: "asc" },
    { name: "Price: High to Low", value: "desc" },
  ];

  return (
    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
      </h1>

      <div className="flex items-center">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
            Sort
            <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
          </Menu.Button>

          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {sortOptions.map((option) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() => setSortOrder(option.value as 'asc' | 'desc')}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-900 w-full text-left`}
                    >
                      {option.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Menu>

        <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
          <span className="sr-only">View grid</span>
          <Grid className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
        >
          <span className="sr-only">Filters</span>
          <Filter className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};