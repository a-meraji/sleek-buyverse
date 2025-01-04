import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('useProducts: Starting products fetch...');
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (*),
            product_images (*)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('useProducts: Error fetching products:', error);
          throw error;
        }

        if (!data) {
          console.log('useProducts: No data returned from query');
          return [];
        }

        const validProducts = data.filter(p => p.id && p.name && p.image_url);
        
        console.log('useProducts: Fetch successful:', {
          totalProducts: data.length,
          validProducts: validProducts.length,
          firstProduct: validProducts[0] ? {
            id: validProducts[0].id,
            name: validProducts[0].name,
            hasVariants: validProducts[0].product_variants?.length > 0
          } : null,
          timestamp: new Date().toISOString()
        });

        return validProducts as Product[];
      } catch (error) {
        console.error('useProducts: Unexpected error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
};