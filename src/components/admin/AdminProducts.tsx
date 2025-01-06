import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductSearchBar } from "./products/ProductSearchBar";
import { ProductHeader } from "./products/ProductHeader";
import { ProductTable } from "./products/ProductTable";
import { ProductDialogs } from "./products/ProductDialogs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PRODUCTS_PER_PAGE = 20;

export function AdminProducts() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <ProductHeader />

      <ProductSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <ProductTable
        products={paginatedProducts}
        productVariants={productVariants}
        expandedProductId={expandedProductId}
        onExpand={setExpandedProductId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <ProductDialogs
        selectedProduct={selectedProduct}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        onEditDialogClose={handleEditDialogClose}
        onDeleteDialogClose={handleDeleteDialogClose}
        onConfirmDelete={handleDeleteDialogClose}
      />
    </div>
  );
}