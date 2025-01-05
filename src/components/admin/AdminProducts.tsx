import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductSearchBar } from "./products/ProductSearchBar";
import { ProductHeader } from "./products/ProductHeader";
import { ProductTable } from "./products/ProductTable";
import { ProductDialogs } from "./products/ProductDialogs";

export function AdminProducts() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*");
      return data;
    }
  });

  const { data: productVariants } = useQuery({
    queryKey: ["productVariants"],
    queryFn: async () => {
      const { data } = await supabase.from("product_variants").select("*");
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
        products={filteredProducts}
        productVariants={productVariants}
        expandedProductId={expandedProductId}
        onExpand={setExpandedProductId}
        onEdit={handleEdit}
        onDelete={handleDelete}
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