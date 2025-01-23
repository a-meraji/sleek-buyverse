import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProductSelection(onProductsChange: (products: string[]) => void) {
  const [isSelectingAll, setIsSelectingAll] = useState(false);

  const { data: allProductIds } = useQuery({
    queryKey: ['all-product-ids'],
    queryFn: async () => {
      console.log('Fetching all product IDs');
      const { data, error } = await supabase
        .from('products')
        .select('id');

      if (error) {
        console.error('Error fetching all product IDs:', error);
        throw error;
      }

      return data.map(product => product.id);
    },
  });

  const toggleSelectAll = () => {
    if (!allProductIds) return;
    
    console.log('Toggling select all products');
    console.log('Current selection state:', isSelectingAll);
    
    if (!isSelectingAll) {
      console.log('Selecting all products:', allProductIds);
      onProductsChange(allProductIds);
    } else {
      console.log('Deselecting all products');
      onProductsChange([]);
    }
    
    setIsSelectingAll(!isSelectingAll);
  };

  return {
    isSelectingAll,
    toggleSelectAll,
  };
}