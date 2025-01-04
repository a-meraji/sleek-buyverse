import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/types";

export const useProducts = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', searchQuery],
    queryFn: async () => {
      console.log('useProducts: Starting products fetch with params:', {
        searchQuery,
        timestamp: new Date().toISOString()
      });
      
      try {
        let query = supabase
          .from('products')
          .select('*, product_variants(*)');

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        console.log('useProducts: Executing query...');
        const { data, error } = await query;
        
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

  // Extract unique categories from products
  const categories = products 
    ? [...new Set(products.filter(p => p.category).map(p => p.category!))]
    : [];

  return {
    products,
    isLoading,
    error,
    categories
  };
};