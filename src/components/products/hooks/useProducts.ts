import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useProducts = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const sort = searchParams.get('sort');
  const category = searchParams.get('category');
  const discount = searchParams.get('discount') === 'true';

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, sort, discount, category],
    queryFn: async () => {
      console.log('Fetching products with filters:', { searchQuery, sort, discount, category });
      
      let query = supabase
        .from('products')
        .select('*, product_variants(*)')

      // Apply search filter if present
      if (searchQuery) {
        console.log('Applying search filter:', searchQuery);
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply category filter if present
      if (category) {
        console.log('Filtering by category:', category);
        query = query.eq('category', category);
      }

      // Apply discount filter
      if (discount) {
        query = query.not('discount', 'is', null)
                    .gt('discount', 0);
      }

      // Apply sorting
      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'popular') {
        const { data: popularProducts } = await supabase
          .rpc('get_popular_products')
          .limit(50);

        if (popularProducts?.length) {
          const popularIds = popularProducts.map(p => p.product_id);
          query = query.in('id', popularIds);
        }
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