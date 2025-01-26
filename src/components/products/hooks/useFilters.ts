import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types';

export const useFilters = (products: Product[] | null) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const mainCategory = searchParams.get('main_category');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    mainCategory ? [mainCategory] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Update selected categories when main_category changes in URL
  useEffect(() => {
    if (mainCategory && !selectedCategories.includes(mainCategory)) {
      setSelectedCategories([mainCategory]);
    }
  }, [mainCategory]);

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
      selectedCategories.includes(product.main_category || '') ||
      (Array.isArray(product.secondary_categories) && 
       product.secondary_categories.some(category => 
         selectedCategories.includes(category)
       ));

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