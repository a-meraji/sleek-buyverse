import { useState } from "react";
import { ProductSearchBar } from "./products/ProductSearchBar";
import { ProductHeader } from "./products/ProductHeader";
import { ProductTable } from "./products/ProductTable";
import { ProductDialogs } from "./products/ProductDialogs";
import { ProductPagination } from "./products/pagination/ProductPagination";
import { useProductList } from "./products/hooks/useProductList";

export function AdminProducts() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    products,
    productVariants,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handlePageChange,
    expandedProductId,
    setExpandedProductId,
  } = useProductList();

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
        products={products}
        productVariants={productVariants}
        expandedProductId={expandedProductId}
        onExpand={setExpandedProductId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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