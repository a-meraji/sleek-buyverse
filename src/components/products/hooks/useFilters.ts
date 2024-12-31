import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useFilters = (products: any[] = []) => {
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      const matchesSearch = urlSearchQuery ? 
        (product.name.toLowerCase().includes(urlSearchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(urlSearchQuery.toLowerCase())) : true;
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);
      
      const matchesPrice = product.price >= priceRange[0] && 
        product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
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