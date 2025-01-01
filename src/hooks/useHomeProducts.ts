import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { useEffect } from "react";

export const useHomeProducts = () => {
  // Log initial hook execution
  useEffect(() => {
    console.log('useHomeProducts hook initialized');
  }, []);

  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Starting products fetch...');
      const startTime = performance.now();

      try {
        console.log('Checking auth status before fetch...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Auth session state:', session ? 'Authenticated' : 'Unauthenticated');
        
        console.log('Sending request to Supabase products table...');
        
        const response = await supabase
          .from('products')
          .select(`
            *,
            product_variants (
              id,
              size,
              color,
              price,
              stock
            ),
            product_images (
              id,
              image_url,
              display_order
            )
          `)
          .order('created_at', { ascending: false });

        const endTime = performance.now();
        
        // Log complete response for debugging
        console.log('Complete Supabase Response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          error: response.error,
          count: response.count,
          queryTime: `${(endTime - startTime).toFixed(2)}ms`
        });

        // Log detailed error information if present
        if (response.error) {
          console.error('Supabase Error Details:', {
            message: response.error.message,
            details: response.error.details,
            hint: response.error.hint,
            code: response.error.code
          });
          throw response.error;
        }

        // Log success metrics and data structure validation
        console.log('Products fetch successful:', {
          count: response.data?.length || 0,
          queryTime: `${(endTime - startTime).toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
          firstProduct: response.data?.[0] ? {
            id: response.data[0].id,
            name: response.data[0].name,
            variantsCount: response.data[0].product_variants?.length,
            imagesCount: response.data[0].product_images?.length,
            hasRequiredFields: Boolean(
              response.data[0].id &&
              response.data[0].name &&
              response.data[0].image_url
            )
          } : null
        });

        return response.data as Product[] || [];
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