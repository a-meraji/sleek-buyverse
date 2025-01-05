import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductTableRow } from "./products/ProductTableRow";
import { ProductTableHeader } from "./products/ProductTableHeader";
import { Table, TableBody } from "@/components/ui/table";
import { EditProductDialog } from "./EditProductDialog";
import { DeleteProductDialog } from "./products/DeleteProductDialog";
import { ProductSearchBar } from "./products/ProductSearchBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export function AdminProducts() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data as Product[];
    }
  });

  const { data: productVariants } = useQuery({
    queryKey: ["productVariants"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_variants").select("*");
      if (error) throw error;
      return data || [];
    }
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => {
          setSelectedProduct(null);
          setIsEditDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductSearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
      />

      <div className="border rounded-lg">
        <Table>
          <ProductTableHeader />
          <TableBody>
            {filteredProducts?.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                variants={productVariants?.filter(v => v.product_id === product.id) || []}
                onEdit={(product) => {
                  setSelectedProduct(product);
                  setIsEditDialogOpen(true);
                  setIsDeleteDialogOpen(false);
                }}
                onDelete={(product) => {
                  setSelectedProduct(product);
                  setIsDeleteDialogOpen(true);
                  setIsEditDialogOpen(false);
                }}
                expandedProductId={expandedProductId}
                onExpand={setExpandedProductId}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <EditProductDialog
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setIsEditDialogOpen(false);
        }}
      />

      <DeleteProductDialog
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setIsDeleteDialogOpen(false);
        }}
        onConfirm={(productId) => {
          console.log('Deleting product:', productId);
          setIsDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}