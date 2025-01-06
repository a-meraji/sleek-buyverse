import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePopularProducts = (currentProductId: string) => {
  return useQuery({
    queryKey: ['popular-products'],
    queryFn: async () => {
      console.log('Fetching popular products');
      
      // Get popular product IDs using the database function
      const { data: popularProducts, error: popularError } = await supabase
        .rpc('get_popular_products')
        .limit(8);

      if (popularError) {
        console.error('Error fetching popular products:', popularError);
        throw popularError;
      }

      console.log('Popular products data:', popularProducts);

      if (!popularProducts?.length) {
        console.log('No popular products found, fetching random products');
        const { data: randomProducts, error: randomError } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .neq('id', currentProductId)
          .limit(8);

        if (randomError) throw randomError;
        return randomProducts;
      }

      // Get the actual product details for popular products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .in('id', popularProducts.map(p => p.product_id))
        .neq('id', currentProductId);

      if (productsError) throw productsError;
      
      console.log('Popular products fetched:', products);
      return products;
    },
  });
};