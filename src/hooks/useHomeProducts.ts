import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { useEffect, useState } from "react";

export const useHomeProducts = () => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    userId: string | null;
  }>({
    isAuthenticated: false,
    userId: null,
  });

  useEffect(() => {
    console.log('useHomeProducts: Hook initialized');
    
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('Session found for user:', session.user.id);
        setAuthState({
          isAuthenticated: true,
          userId: session.user.id,
        });
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('useHomeProducts: Auth state changed:', { event: _event, userId: session?.user?.id });
      setAuthState({
        isAuthenticated: !!session?.user,
        userId: session?.user?.id || null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('useHomeProducts: Starting products fetch...');
      console.log('useHomeProducts: Auth state:', authState);
      
      const startTime = performance.now();

      try {
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
          console.error('useHomeProducts: Error fetching products:', error);
          throw error;
        }

        // Validate and log success metrics
        const validProducts = data?.filter(p => p.id && p.name && p.image_url) || [];
        console.log('useHomeProducts: Fetch successful:', {
          totalProducts: data?.length || 0,
          validProducts: validProducts?.length || 0,
          queryTime: `${(endTime - startTime).toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
          sampleProduct: validProducts[0] ? {
            id: validProducts[0].id,
            name: validProducts[0].name,
            variantsCount: validProducts[0].product_variants?.length,
            imagesCount: validProducts[0].product_images?.length,
            isValid: Boolean(
              validProducts[0].id &&
              validProducts[0].name &&
              validProducts[0].image_url
            )
          } : null
        });

        return validProducts as Product[];
      } catch (error) {
        console.error('useHomeProducts: Unexpected error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  return { products, isLoading, error };
};