import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useProducts = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const sort = searchParams.get('sort');
  const selectedCategories = searchParams.getAll('category');
  const discount = searchParams.get('discount') === 'true';

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, sort, discount, selectedCategories],
    queryFn: async () => {
      console.log('Fetching products with filters:', { searchQuery, sort, discount, selectedCategories });
      
      let query = supabase
        .from('products')
        .select('*, product_variants(*)')

      // Apply search filter if present
      if (searchQuery) {
        console.log('Applying search filter:', searchQuery);
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply category filters
      if (selectedCategories.length > 0) {
        console.log('Filtering by categories:', selectedCategories);
        query = query.or(
          selectedCategories.map(category => 
            `main_category.ilike.${category},secondary_categories::text.ilike.%${category}%`
          ).join(',')
        );
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
  const mainCategories = products 
    ? [...new Set(products.filter(p => p.main_category).map(p => p.main_category!))]
    : [];

  const secondaryCategories = products
    ? [...new Set(products.flatMap(p => 
        Array.isArray(p.secondary_categories) ? p.secondary_categories : []
      ))]
    : [];

  const allCategories = [...new Set([...mainCategories, ...secondaryCategories])];

  return {
    products,
    isLoading,
    error,
    categories: allCategories
  };
};