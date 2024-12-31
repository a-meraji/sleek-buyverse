import { useEffect, useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { FilterSidebar } from "./FilterSidebar";
import { MobileFilters } from "./MobileFilters";
import { ProductsHeader } from "./ProductsHeader";
import { useProducts } from "./hooks/useProducts";
import { useFilters } from "./hooks/useFilters";

export const ProductsContainer = () => {
  const {
    products,
    isLoading,
    error
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

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex gap-8 items-start">
        <FilterSidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          className="hidden lg:block sticky top-8"
        />
        
        <div className="flex-1">
          <MobileFilters
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
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