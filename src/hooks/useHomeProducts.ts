import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { useEffect } from "react";

export const useHomeProducts = () => {
  // Log initial hook execution
  useEffect(() => {
    console.log('useHomeProducts: Hook initialized');
  }, []);

  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('useHomeProducts: Starting products fetch...');
      const startTime = performance.now();

      try {
        // Check authentication status
        console.log('useHomeProducts: Checking auth status...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('useHomeProducts: Auth state:', {
          isAuthenticated: !!session,
          userId: session?.user?.id
        });

        // Fetch products with related data
        console.log('useHomeProducts: Fetching products with variants and images...');
        const { data, error } = await supabase
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
        
        if (error) {
          console.error('useHomeProducts: Error fetching products:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        // Validate and log success metrics
        const validProducts = data?.filter(p => p.id && p.name && p.image_url);
        console.log('useHomeProducts: Fetch successful:', {
          totalProducts: data?.length || 0,
          validProducts: validProducts?.length || 0,
          queryTime: `${(endTime - startTime).toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
          sampleProduct: data?.[0] ? {
            id: data[0].id,
            name: data[0].name,
            variantsCount: data[0].product_variants?.length,
            imagesCount: data[0].product_images?.length,
            isValid: Boolean(
              data[0].id &&
              data[0].name &&
              data[0].image_url
            )
          } : null
        });

        return validProducts as Product[] || [];
      } catch (error) {
        console.error('useHomeProducts: Unexpected error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};