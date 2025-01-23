import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProductSearchInput } from "./product-selector/ProductSearchInput";
import { ProductList } from "./product-selector/ProductList";
import { SelectedProducts } from "./product-selector/SelectedProducts";
import { Product } from "@/types";

const PRODUCTS_PER_PAGE = 20;

interface ProductSelectorProps {
  selectedProducts: string[];
  onProductsChange: (products: string[]) => void;
}

export function ProductSelector({ selectedProducts = [], onProductsChange }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm, currentPage],
    queryFn: async () => {
      console.log('Fetching products with filters:', { searchTerm, currentPage });
      
      let query = supabase
        .from('products')
        .select('*')
        .range((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE - 1);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Fetched products:', data);
      return data as Product[];
    },
  });

  const toggleProduct = (productId: string) => {
    console.log('Toggling product:', productId);
    const newSelection = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    console.log('New selection:', newSelection);
    onProductsChange(newSelection);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedProducts.length > 0
              ? `${selectedProducts.length} products selected`
              : "Select products..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-2 space-y-2">
            <ProductSearchInput
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
            />
            {products && products.length > 0 ? (
              <ProductList
                products={products}
                selectedProducts={selectedProducts}
                onToggleProduct={toggleProduct}
              />
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No products found
              </div>
            )}
            <div className="flex justify-between items-center px-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!products || products.length < PRODUCTS_PER_PAGE}
              >
                Next
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {products && (
        <SelectedProducts
          products={products}
          selectedProducts={selectedProducts}
          onRemove={toggleProduct}
        />
      )}
    </div>
  );
}