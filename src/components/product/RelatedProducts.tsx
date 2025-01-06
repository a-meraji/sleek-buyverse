import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCarousel } from "../home/ProductCarousel";

interface RelatedProductsProps {
  currentProductId: string;
  category: string | null;
}

export const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const { data: relatedProducts, isLoading } = useQuery({
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

  if (isLoading || !relatedProducts?.length) return null;

  return (
    <ProductCarousel
      title="Related Products"
      products={relatedProducts}
    />
  );
};