import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useHomeProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Starting products fetch...');
      const startTime = performance.now();

      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (*),
            product_images (*)
          `)
          .order('created_at', { ascending: false });

        const endTime = performance.now();
        console.log(`Products query took ${endTime - startTime}ms`);

        if (productsError) {
          console.error('Error fetching products:', productsError);
          throw productsError;
        }

        if (!productsData) {
          console.log('No products found');
          return [];
        }

        console.log('Products fetched successfully:', {
          count: productsData.length,
          firstProduct: productsData[0],
          hasVariants: productsData[0]?.product_variants?.length > 0
        });

        return productsData as Product[];
      } catch (error) {
        console.error('Error in products query:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Reduce retry attempts
    refetchOnWindowFocus: false,
    initialData: [], // Provide initial data to prevent loading state
  });
};