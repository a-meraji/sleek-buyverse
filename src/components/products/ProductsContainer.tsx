import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  const {
    products,
    isLoading,
    error,
    categories,
    brands
  } = useProducts();

  const {
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    setSelectedCategories,
    setSelectedBrands,
    setPriceRange,
    filteredProducts
  } = useFilters(products);

  const handleClearFilters = () => {
    navigate('/products');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
  };

  const handleClearCategory = (categoryToRemove: string) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleClearBrand = (brandToRemove: string) => {
    setSelectedBrands(selectedBrands.filter(brand => brand !== brandToRemove));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsHeader 
        searchQuery={searchQuery}
        setSortOrder={setSortOrder}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />
      
      <SearchBadge
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        onClear={handleClearFilters}
        onClearCategory={handleClearCategory}
        onClearBrand={handleClearBrand}
      />
      
      <div className="flex gap-8 items-start mt-4">
        <FilterSidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
          brands={brands}
          className="hidden lg:block sticky top-8"
        />
        
        <div className="flex-1">
          <MobileFilters
            open={mobileFiltersOpen}
            setOpen={setMobileFiltersOpen}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
            brands={brands}
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