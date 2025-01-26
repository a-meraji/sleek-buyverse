import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types';

export const useFilters = (products: Product[] | null) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll('category') || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    if (products) {
      const prices = products.flatMap(product => 
        product.product_variants?.map(variant => Number(variant.price)) || []
      );
      const maxPrice = Math.max(...prices, 0);
      setPriceRange([0, maxPrice]);
    }
  }, [products]);

  const filteredProducts = products?.filter(product => {
    // Filter by search query
    const matchesSearch = 
      !searchQuery || 
      product.name.toLowerCase().includes(searchQuery) ||
      product.description?.toLowerCase().includes(searchQuery);

    // Filter by categories
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.some(category => 
        product.main_category === category ||
        (Array.isArray(product.secondary_categories) && 
         product.secondary_categories.includes(category))
      );

    // Filter by price range
    const matchesPrice = product.product_variants?.some(
      variant => 
        Number(variant.price) >= priceRange[0] && 
        Number(variant.price) <= priceRange[1]
    );

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return {
    searchQuery,
    selectedCategories,
    priceRange,
    setSelectedCategories,
    setPriceRange,
    filteredProducts
  };
};