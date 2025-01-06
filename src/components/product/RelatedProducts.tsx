import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCarousel } from "../home/ProductCarousel";

interface RelatedProductsProps {
  currentProductId: string;
  category: string | null;
}

interface OrderCount {
  product_id: string;
  count: number;
}

export const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
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

  const { data: popularProducts, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popular-products'],
    queryFn: async () => {
      console.log('Fetching popular products');
      
      // Get the most ordered products using count aggregation
      const { data: orderCounts, error: orderError } = await supabase
        .from('order_items')
        .select('product_id, count(*)')
        .group('product_id')
        .order('count', { ascending: false })
        .limit(8);

      if (orderError) {
        console.error('Error fetching popular products:', orderError);
        throw orderError;
      }

      if (!orderCounts?.length) return [];

      // Get the actual product details
      const productIds = orderCounts.map((item: OrderCount) => item.product_id);
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .in('id', productIds);

      if (productsError) {
        console.error('Error fetching product details:', productsError);
        throw productsError;
      }

      console.log('Popular products fetched:', products);
      return products;
    },
  });

  if (isLoadingRelated || isLoadingPopular) return null;

  // If there are related products, show them
  if (relatedProducts && relatedProducts.length > 0) {
    return (
      <ProductCarousel
        title="Related Products"
        products={relatedProducts}
      />
    );
  }

  // If no related products but we have popular products, show those instead
  if (popularProducts && popularProducts.length > 0) {
    return (
      <ProductCarousel
        title="Popular Products"
        products={popularProducts}
      />
    );
  }

  // If neither related nor popular products are available, return null
  return null;
};