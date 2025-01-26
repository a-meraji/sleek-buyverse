import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

interface UseRelatedProductsProps {
  currentProductId: string;
  mainCategory: string | null;
  secondaryCategories?: string[];
}

export const useRelatedProducts = ({ 
  currentProductId, 
  mainCategory,
  secondaryCategories 
}: UseRelatedProductsProps) => {
  return useQuery({
    queryKey: ['related-products', mainCategory, secondaryCategories, currentProductId],
    queryFn: async () => {
      console.log('Fetching related products for:', { mainCategory, secondaryCategories });
      
      if (!mainCategory && (!secondaryCategories || secondaryCategories.length === 0)) {
        console.log('No categories available for related products');
        return [];
      }

      // First try to find products with matching main category
      let { data: mainCategoryProducts, error: mainError } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .eq('main_category', mainCategory)
        .neq('id', currentProductId)
        .limit(8);

      if (mainError) {
        console.error('Error fetching main category products:', mainError);
        throw mainError;
      }

      // If we don't have enough products from main category, look in secondary categories
      if ((!mainCategoryProducts || mainCategoryProducts.length < 8) && secondaryCategories?.length) {
        console.log('Fetching additional products from secondary categories');
        
        const { data: secondaryProducts, error: secondaryError } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .neq('id', currentProductId)
          .neq('main_category', mainCategory) // Exclude products we already have
          .or(
            secondaryCategories.map(category => 
              `secondary_categories->>'${category}' is not null`
            ).join(',')
          )
          .limit(8 - (mainCategoryProducts?.length || 0));

        if (secondaryError) {
          console.error('Error fetching secondary category products:', secondaryError);
          throw secondaryError;
        }

        mainCategoryProducts = [
          ...(mainCategoryProducts || []),
          ...(secondaryProducts || [])
        ];
      }

      console.log('Related products fetched:', mainCategoryProducts);
      return mainCategoryProducts || [];
    },
    enabled: !!currentProductId,
  });
};