import { useSearchParams } from "react-router-dom";
import { SortMenu } from "./header/SortMenu";
import { FilterButtons } from "./header/FilterButtons";
import { ViewControls } from "./header/ViewControls";

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

  const handleFilterClick = (filter: string) => {
    const isDiscounted = searchParams.get('discount') === 'true';
    
    if (filter === 'discount') {
      if (isDiscounted) {
        searchParams.delete('discount');
      } else {
        searchParams.set('discount', 'true');
      }
      searchParams.delete('sort');
    } else {
      if (searchParams.get('sort') === filter) {
        searchParams.delete('sort');
      } else {
        searchParams.set('sort', filter);
      }
      searchParams.delete('discount');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900">
        {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
      </h1>

      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:gap-4">
        <FilterButtons handleFilterClick={handleFilterClick} />
        <div className="flex items-center justify-between md:justify-start gap-2">
          <SortMenu setSortOrder={setSortOrder} />
          <ViewControls setMobileFiltersOpen={setMobileFiltersOpen} />
        </div>
      </div>
    </div>
  );
};