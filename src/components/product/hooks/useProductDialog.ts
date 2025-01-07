import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export const useProductDialog = (productId: string) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productData, setProductData] = useState<Product | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('ProductCard auth state changed:', event, session);
      setUserId(session?.user?.id ?? null);
    });

    // Fetch full product data when dialog is opened
    if (isDialogOpen && !productData) {
      supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('id', productId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching product:', error);
            return;
          }
          setProductData(data);
        });
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [productId, isDialogOpen, productData]);

  return {
    userId,
    isDialogOpen,
    setIsDialogOpen,
    productData
  };
};