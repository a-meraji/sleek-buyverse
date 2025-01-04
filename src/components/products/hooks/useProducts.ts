import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = () => {
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: async () => {
      console.log('useProducts: Starting products fetch with params:', {
        searchQuery: urlSearchQuery,
        timestamp: new Date().toISOString()
      });
      
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            product_variants (*)
          `);

        if (urlSearchQuery) {
          query = query.ilike('name', `%${urlSearchQuery}%`);
        }
        
        console.log('useProducts: Executing query...');
        const { data, error, status, statusText } = await query;
        
        console.log('useProducts: Query response:', {
          status,
          statusText,
          hasError: !!error,
          dataLength: data?.length,
          timestamp: new Date().toISOString()
        });

        if (error) {
          console.error('useProducts: Error fetching products:', {
            error,
            code: error.code,
            details: error.details,
            hint: error.hint,
            timestamp: new Date().toISOString()
          });
          throw error;
        }
        
        if (!data) {
          console.log('useProducts: No data returned');
          return [];
        }
        
        console.log('useProducts: Fetch successful:', {
          totalProducts: data.length,
          firstProduct: data[0],
          timestamp: new Date().toISOString()
        });
        
        return data;
      } catch (err) {
        console.error('useProducts: Unexpected error:', {
          error: err,
          timestamp: new Date().toISOString()
        });
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1 // Limit retries to avoid infinite loops
  });

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

  // Extract unique categories from products
  const categories = products 
    ? [...new Set(products.filter(p => p.category).map(p => p.category!))]
    : [];

  return {
    products,
    isLoading,
    error,
    categories,
    searchQuery: urlSearchQuery,
    selectedCategories,
    priceRange,
    setSelectedCategories,
    setPriceRange,
    filteredProducts
  };
};