import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

interface FavoriteProduct {
  product_id: string;
  products: Product;
}

export function useFavorites(userId: string) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      console.log('Fetching favorites for user:', userId);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          product_id,
          products (
            id,
            name,
            description,
            image_url,
            category,
            sku,
            discount,
            product_variants (
              id,
              size,
              color,
              stock,
              price
            )
          )
        `)
        .eq('user_id', userId);

      const endTime = performance.now();
      console.log(`Favorites query took ${endTime - startTime}ms`);

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
      
      console.log('Raw favorites data:', data);
      
      const transformedData = data?.map(item => ({
        product_id: item.product_id,
        products: item.products as Product
      }));
      
      console.log('Transformed favorites data:', transformedData);
      return transformedData as FavoriteProduct[];
    },
    enabled: !!userId,
    retry: 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}