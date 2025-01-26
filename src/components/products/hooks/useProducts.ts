import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useProducts = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const sort = searchParams.get('sort');
  const mainCategory = searchParams.get('main_category');
  const discount = searchParams.get('discount') === 'true';

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, sort, discount, mainCategory],
    queryFn: async () => {
      console.log('Fetching products with filters:', { searchQuery, sort, discount, mainCategory });
      
      let query = supabase
        .from('products')
        .select(`
          *,
          product_variants(*)
        `)

      // Apply search filter if present
      if (searchQuery) {
        console.log('Applying search filter:', searchQuery);
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply main category filter
      if (mainCategory) {
        console.log('Filtering by main category:', mainCategory);
        query = query.eq('main_category', mainCategory);
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

  // Extract unique brands from products
  const brands = products
    ? [...new Set(products.filter(p => p.brand).map(p => p.brand!))]
    : [];

  return {
    products,
    isLoading,
    error,
    categories: allCategories,
    brands
  };
};