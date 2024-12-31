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
      console.log('Fetching products with search query:', searchQuery);
      
      let query = supabase
        .from('products')
        .select('*, product_variants(*)');

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Fetched products:', data);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
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