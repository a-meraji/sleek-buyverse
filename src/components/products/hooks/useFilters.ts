import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from "@/types";

export const useFilters = (products: Product[] = []) => {
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filteredProducts = useMemo(() => {
    console.log('Filtering products:', { 
      totalProducts: products?.length,
      searchQuery: urlSearchQuery,
      selectedCategories,
      priceRange
    });

    return products?.filter(product => {
      // Search filter
      const matchesSearch = !urlSearchQuery || 
        product.name.toLowerCase().includes(urlSearchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(urlSearchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        (product.category && selectedCategories.includes(product.category));
      
      // Price filter - use minimum price from variants
      const minPrice = product.product_variants?.length 
        ? Math.min(...product.product_variants.map(v => v.price))
        : 0;
      const matchesPrice = minPrice >= priceRange[0] && minPrice <= priceRange[1];

      const isIncluded = matchesSearch && matchesCategory && matchesPrice;
      console.log(`Product ${product.name}:`, { 
        matchesSearch, 
        matchesCategory, 
        matchesPrice,
        isIncluded 
      });

      return isIncluded;
    }) || [];
  }, [products, urlSearchQuery, selectedCategories, priceRange]);

  return {
    searchQuery: urlSearchQuery,
    selectedCategories,
    priceRange,
    setSelectedCategories,
    setPriceRange,
    filteredProducts
  };
};