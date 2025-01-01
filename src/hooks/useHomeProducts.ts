import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Product } from "@/types";

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
            isValid: true
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