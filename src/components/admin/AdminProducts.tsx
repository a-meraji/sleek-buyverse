import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { ProductForm } from "./ProductForm";
import { EditProductDialog } from "./EditProductDialog";
import { ProductSearchBar } from "./products/ProductSearchBar";
import { ProductTableHeader } from "./products/ProductTableHeader";
import { ProductTableRow } from "./products/ProductTableRow";
import { DeleteProductDialog } from "./products/DeleteProductDialog";
import { useProductDelete } from "./products/useProductDelete";

export function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const deleteProduct = useProductDelete();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Fetch variants for all products
      const { data: variants, error: variantsError } = await supabase
        .from("product_variants")
        .select("*");

      if (variantsError) throw variantsError;

      // Group variants by product
      const variantsByProduct = variants.reduce((acc, variant) => {
        if (!acc[variant.product_id]) {
          acc[variant.product_id] = [];
        }
        acc[variant.product_id].push(variant);
        return acc;
      }, {} as Record<string, any[]>);

      return {
        products,
        variantsByProduct,
      };
    },
  });

  const filteredProducts = productsData?.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = (productId: string) => {
    deleteProduct.mutate(productId, {
      onSuccess: () => setProductToDelete(null),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ProductSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {showForm && <ProductForm onClose={() => setShowForm(false)} />}

      <Table>
        <ProductTableHeader />
        <TableBody>
          {filteredProducts?.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              variants={productsData?.variantsByProduct[product.id] || []}
              onEdit={setSelectedProduct}
              onDelete={setProductToDelete}
            />
          ))}
        </TableBody>
      </Table>

      <EditProductDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <DeleteProductDialog
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}