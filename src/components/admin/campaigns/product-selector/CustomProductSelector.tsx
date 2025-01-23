import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { ProductSelectorModal } from "./ProductSelectorModal";

const PRODUCTS_PER_PAGE = 20;

interface CustomProductSelectorProps {
  selectedProducts: string[];
  onProductsChange: (products: string[]) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function CustomProductSelector({ 
  selectedProducts = [], 
  onProductsChange,
  onClose,
  isOpen 
}: CustomProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectingAll, setIsSelectingAll] = useState(false);

  // Query for paginated products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm, currentPage],
    queryFn: async () => {
      console.log('Fetching paginated products with filters:', { searchTerm, currentPage });
      
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

      return data as Product[];
    },
  });

  // Query for all product IDs (used for select all functionality)
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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const toggleProduct = (productId: string) => {
    console.log('Toggling product:', productId);
    console.log('Current selected products:', selectedProducts);
    const newSelection = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    console.log('New selection:', newSelection);
    onProductsChange(newSelection);
  };

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

  if (!isOpen) return null;

  return (
    <ProductSelectorModal
      products={products}
      selectedProducts={selectedProducts}
      onToggleProduct={toggleProduct}
      onClose={onClose}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      PRODUCTS_PER_PAGE={PRODUCTS_PER_PAGE}
      onToggleSelectAll={toggleSelectAll}
      isSelectingAll={isSelectingAll}
    />
  );
}