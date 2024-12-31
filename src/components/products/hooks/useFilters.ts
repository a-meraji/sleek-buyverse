import { useState, useMemo } from 'react';

export const useFilters = (products: any[] = []) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);
      
      const matchesPrice = product.price >= priceRange[0] && 
        product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    }) || [];
  }, [products, searchQuery, selectedCategories, priceRange]);

  return {
    searchQuery,
    selectedCategories,
    priceRange,
    setSearchQuery,
    setSelectedCategories,
    setPriceRange,
    filteredProducts
  };
};