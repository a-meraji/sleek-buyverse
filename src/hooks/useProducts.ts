import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('useProducts: Starting products fetch with timestamp:', new Date().toISOString());
      
      try {
        // First, fetch just the products to verify the connection
        const productsCheck = await supabase
          .from('products')
          .select('id')
          .limit(1);

        console.log('useProducts: Connection check result:', {
          error: productsCheck.error,
          status: productsCheck.status,
          statusText: productsCheck.statusText,
          timestamp: new Date().toISOString()
        });

        if (productsCheck.error) {
          console.error('useProducts: Initial connection check failed:', productsCheck.error);
          throw productsCheck.error;
        }

        // Now fetch the full data with relations
        const { data, error, status, statusText } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (
              id,
              size,
              color,
              stock,
              price
            ),
            product_images (
              id,
              image_url,
              display_order
            )
          `)
          .order('created_at', { ascending: false })
          .limit(50); // Add a reasonable limit

        console.log('useProducts: Main query response:', {
          status,
          statusText,
          hasError: !!error,
          dataReceived: !!data,
          timestamp: new Date().toISOString()
        });

        if (error) {
          console.error('useProducts: Error fetching products:', {
            error,
            code: error.code,
            details: error.details,
            hint: error.hint,
            timestamp: new Date().toISOString()
          });
          throw error;
        }

        if (!data) {
          console.log('useProducts: No data returned from query');
          return [];
        }

        const validProducts = data.filter(p => {
          const isValid = p.id && p.name && p.image_url;
          if (!isValid) {
            console.warn('useProducts: Found invalid product:', {
              id: p.id,
              hasName: !!p.name,
              hasImage: !!p.image_url,
              timestamp: new Date().toISOString()
            });
          }
          return isValid;
        });
        
        console.log('useProducts: Fetch successful:', {
          totalProducts: data.length,
          validProducts: validProducts.length,
          firstProduct: validProducts[0] ? {
            id: validProducts[0].id,
            name: validProducts[0].name,
            hasVariants: validProducts[0].product_variants?.length > 0,
            variantsCount: validProducts[0].product_variants?.length,
            imagesCount: validProducts[0].product_images?.length
          } : null,
          timestamp: new Date().toISOString()
        });

        return validProducts as Product[];
      } catch (error) {
        console.error('useProducts: Unexpected error:', {
          error,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
};