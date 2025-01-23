import { useProductSearch } from "./hooks/useProductSearch";
import { useProductSelection } from "./hooks/useProductSelection";
import { ProductSelectorModal } from "./ProductSelectorModal";

interface CustomProductSelectorProps {
  selectedProducts: string[];
  onProductsChange: (products: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomProductSelector({
  selectedProducts,
  onProductsChange,
  isOpen,
  onClose,
}: CustomProductSelectorProps) {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    products,
    isLoading,
    PRODUCTS_PER_PAGE,
  } = useProductSearch();

  const { isSelectingAll, toggleSelectAll } = useProductSelection(onProductsChange);

  const handleProductSelect = (productId: string) => {
    console.log('Selecting product:', productId);
    const isSelected = selectedProducts.includes(productId);
    const newSelection = isSelected
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    
    console.log('New selection:', newSelection);
    onProductsChange(newSelection);
  };

  if (!isOpen) return null;

  return (
    <ProductSelectorModal
      products={products}
      selectedProducts={selectedProducts}
      onProductSelect={handleProductSelect}
      onClose={onClose}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      isLoading={isLoading}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      PRODUCTS_PER_PAGE={PRODUCTS_PER_PAGE}
      onToggleSelectAll={toggleSelectAll}
      isSelectingAll={isSelectingAll}
    />
  );
}