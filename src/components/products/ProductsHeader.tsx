import { Menu } from "@headlessui/react";
import { ChevronDown, Filter, Grid, Star, Clock, Tag } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get('sort');
  const isDiscounted = searchParams.get('discount') === 'true';

  const handleFilterClick = (filter: string) => {
    if (filter === 'discount') {
      if (isDiscounted) {
        searchParams.delete('discount');
      } else {
        searchParams.set('discount', 'true');
      }
      searchParams.delete('sort');
    } else {
      if (currentSort === filter) {
        searchParams.delete('sort');
      } else {
        searchParams.set('sort', filter);
      }
      searchParams.delete('discount');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterClick('newest')}
            className={cn(
              "gap-2",
              currentSort === 'newest' && "bg-primary text-white hover:bg-primary/90"
            )}
          >
            <Clock className="h-4 w-4" />
            New Arrivals
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterClick('popular')}
            className={cn(
              "gap-2",
              currentSort === 'popular' && "bg-primary text-white hover:bg-primary/90"
            )}
          >
            <Star className="h-4 w-4" />
            Popular
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterClick('discount')}
            className={cn(
              "gap-2",
              isDiscounted && "bg-primary text-white hover:bg-primary/90"
            )}
          >
            <Tag className="h-4 w-4" />
            Special Offers
          </Button>
        </div>

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
            Sort
            <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
          </Menu.Button>

          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortOrder('asc')}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block px-4 py-2 text-sm text-gray-900 w-full text-left`}
                  >
                    Price: Low to High
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortOrder('desc')}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block px-4 py-2 text-sm text-gray-900 w-full text-left`}
                  >
                    Price: High to Low
                  </button>
                )}
              </Menu.Item>
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