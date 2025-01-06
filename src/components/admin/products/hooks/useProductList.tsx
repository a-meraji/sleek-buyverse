import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PRODUCTS_PER_PAGE = 20;

export function useProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      console.log('Fetching products for admin dashboard');
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      console.log('Fetched products:', data);
      return data;
    }
  });

  const { data: productVariants } = useQuery({
    queryKey: ["admin-product-variants"],
    queryFn: async () => {
      console.log('Fetching product variants');
      const { data, error } = await supabase.from("product_variants").select("*");
      if (error) {
        console.error('Error fetching variants:', error);
        throw error;
      }
      console.log('Fetched variants:', data);
      return data;
    }
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil((filteredProducts?.length || 0) / PRODUCTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts?.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  // Add debug logs
  console.log('Filtered products length:', filteredProducts?.length);
  console.log('Total pages:', totalPages);
  console.log('Current page:', currentPage);
  console.log('Products per page:', PRODUCTS_PER_PAGE);
  console.log('Paginated products:', paginatedProducts?.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedProductId(null); // Reset expanded row when changing pages
  };

  return {
    products: paginatedProducts,
    productVariants,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handlePageChange,
    expandedProductId,
    setExpandedProductId,
  };
}