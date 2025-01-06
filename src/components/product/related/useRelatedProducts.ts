import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

interface UseRelatedProductsProps {
  currentProductId: string;
  category: string | null;
}

export const useRelatedProducts = ({ currentProductId, category }: UseRelatedProductsProps) => {
  return useQuery({
    queryKey: ['related-products', category, currentProductId],
    queryFn: async () => {
      console.log('Fetching related products for category:', category);
      if (!category) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('category', category)
        .neq('id', currentProductId)
        .limit(8);

      if (error) {
        console.error('Error fetching related products:', error);
        throw error;
      }

      console.log('Related products fetched:', data);
      return data;
    },
    enabled: !!category,
  });
};