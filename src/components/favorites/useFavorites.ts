import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

interface FavoriteProduct {
  product_id: string;
  products: Product;
}

// Type for the raw Supabase response
interface SupabaseFavoriteResponse {
  product_id: string;
  products: {
    id: string;
    name: string;
    description: string | null;
    image_url: string;
    category: string | null;
    sku: string | null;
    discount: number | null;
    product_variants?: {
      id: string;
      size: string;
      color: string;
      stock: number;
      price: number;
    }[];
  };
}

export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) {
        console.log('No user ID provided for favorites query');
        return [];
      }

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
      
      // Transform the data with proper typing and null checks
      const transformedData = (data as unknown as SupabaseFavoriteResponse[])?.map(item => ({
        product_id: item.product_id,
        products: {
          id: item.products.id,
          name: item.products.name,
          description: item.products.description,
          image_url: item.products.image_url,
          category: item.products.category,
          sku: item.products.sku,
          discount: item.products.discount,
          product_variants: item.products.product_variants?.map(variant => ({
            id: variant.id,
            product_id: item.products.id,
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
            price: variant.price
          }))
        } as Product
      }));
      
      console.log('Transformed favorites data:', transformedData);
      return transformedData as FavoriteProduct[];
    },
    enabled: !!userId,
    retry: 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}