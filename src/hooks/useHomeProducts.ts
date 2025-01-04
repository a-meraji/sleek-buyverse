import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "./useAuthState";
import { Product } from "@/types";

export const useHomeProducts = () => {
  const { isInitialized } = useAuthState();

  return useQuery({
    queryKey: ['products', isInitialized],
    queryFn: async () => {
      console.log('useHomeProducts: Starting products fetch...', {
        isInitialized,
        timestamp: new Date().toISOString()
      });
      
      if (!isInitialized) {
        console.log('useHomeProducts: Auth not initialized yet, delaying fetch');
        return [];
      }

      try {
        console.log('useHomeProducts: Fetching products with variants and images...');
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (*),
            product_images (*)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('useHomeProducts: Error fetching products:', error);
          throw error;
        }

        const validProducts = data?.filter(p => p.id && p.name && p.image_url) || [];
        
        console.log('useHomeProducts: Fetch successful:', {
          totalProducts: data?.length || 0,
          validProducts: validProducts.length,
          timestamp: new Date().toISOString(),
          sampleProduct: validProducts[0] ? {
            id: validProducts[0].id,
            name: validProducts[0].name,
            variantsCount: validProducts[0].product_variants?.length,
            imagesCount: validProducts[0].product_images?.length,
          } : null
        });

        return validProducts as Product[];
      } catch (error) {
        console.error('useHomeProducts: Unexpected error:', error);
        throw error;
      }
    },
    enabled: isInitialized,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
};