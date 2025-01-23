import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export function useProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm, currentPage],
    queryFn: async () => {
      console.log('Fetching paginated products with filters:', { searchTerm, currentPage });
      
      let query = supabase
        .from('products')
        .select('*, product_variants(*)');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      query = query
        .range((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE - 1)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return data as Product[];
    },
  });

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    products,
    isLoading,
    PRODUCTS_PER_PAGE,
  };
}