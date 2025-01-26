import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from "@/types";

export const useFilters = (products: Product[] = []) => {
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filteredProducts = useMemo(() => {
    console.log('Filtering products by price range:', { 
      totalProducts: products?.length,
      priceRange
    });

    return products?.filter(product => {
      // Price filter - use minimum price from variants
      const minPrice = product.product_variants?.length 
        ? Math.min(...product.product_variants.map(v => v.price))
        : 0;
      const matchesPrice = minPrice >= priceRange[0] && minPrice <= priceRange[1];

      const isIncluded = matchesPrice;
      console.log(`Product ${product.name}:`, { 
        matchesPrice,
        isIncluded 
      });

      return isIncluded;
    }) || [];
  }, [products, priceRange]);

  return {
    searchQuery: urlSearchQuery,
    selectedCategories,
    priceRange,
    setSelectedCategories,
    setPriceRange,
    filteredProducts
  };
};