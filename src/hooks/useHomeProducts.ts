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
        console.log('Sending request to Supabase products table...');
        
        const { data: productsData, error: productsError, status, statusText } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (*),
            product_images (*)
          `)
          .order('created_at', { ascending: false });

        const endTime = performance.now();
        
        // Log the raw response first
        console.log('Raw Supabase Response:', {
          status,
          statusText,
          hasError: !!productsError,
          hasData: !!productsData,
          rawData: productsData,
          error: productsError
        });

        // Then log the detailed API response metrics
        console.log('Products API Response Details:', {
          status,
          statusText,
          error: productsError,
          dataLength: productsData?.length || 0,
          queryTime: `${(endTime - startTime).toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        });

        if (productsError) {
          console.error('Error fetching products:', {
            message: productsError.message,
            details: productsError.details,
            hint: productsError.hint,
            code: productsError.code
          });
          throw productsError;
        }

        if (!productsData) {
          console.log('No products found in response');
          return [];
        }

        console.log('Products fetch successful:', {
          count: productsData.length,
          firstProduct: productsData[0] ? {
            id: productsData[0].id,
            name: productsData[0].name,
            variantsCount: productsData[0].product_variants?.length,
            imagesCount: productsData[0].product_images?.length,
            fullProduct: productsData[0] // Log the complete first product for debugging
          } : null,
          lastProduct: productsData[productsData.length - 1] ? {
            id: productsData[productsData.length - 1].id,
            name: productsData[productsData.length - 1].name
          } : null
        });

        return productsData as Product[];
      } catch (error) {
        console.error('Unexpected error in products query:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};