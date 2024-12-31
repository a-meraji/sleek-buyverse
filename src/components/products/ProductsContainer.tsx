import { useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { FilterSidebar } from "./FilterSidebar";
import { MobileFilters } from "./MobileFilters";
import { ProductsHeader } from "./ProductsHeader";
import { SearchBadge } from "./SearchBadge";
import { useProducts } from "./hooks/useProducts";
import { useFilters } from "./hooks/useFilters";

export const ProductsContainer = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const {
    products,
    isLoading,
    error,
    categories
  } = useProducts();

  const {
    searchQuery,
    selectedCategories,
    priceRange,
    setSearchQuery,
    setSelectedCategories,
    setPriceRange,
    filteredProducts
  } = useFilters(products);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
  };

  const handleClearCategory = (categoryToRemove: string) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSortOrder={setSortOrder}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />
      
      <SearchBadge
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        onClear={handleClearFilters}
        onClearCategory={handleClearCategory}
      />
      
      <div className="flex gap-8 items-start mt-4">
        <FilterSidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
          className="hidden lg:block sticky top-8"
        />
        
        <div className="flex-1">
          <MobileFilters
            open={mobileFiltersOpen}
            setOpen={setMobileFiltersOpen}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
          />
          
          <ProductGrid 
            products={filteredProducts}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};