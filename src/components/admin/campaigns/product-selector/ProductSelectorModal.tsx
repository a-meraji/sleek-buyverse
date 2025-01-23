import { X, Check } from "lucide-react";
import { Product } from "@/types";
import { SearchInput } from "./components/SearchInput";
import { SelectAllButton } from "./components/SelectAllButton";

interface ProductSelectorModalProps {
  products: Product[] | null;
  selectedProducts: string[];
  onProductSelect: (productId: string) => void;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  PRODUCTS_PER_PAGE: number;
  onToggleSelectAll: () => void;
  isSelectingAll: boolean;
}

export function ProductSelectorModal({
  products,
  selectedProducts,
  onProductSelect,
  onClose,
  searchTerm,
  onSearchChange,
  isLoading,
  currentPage,
  onPageChange,
  PRODUCTS_PER_PAGE,
  onToggleSelectAll,
  isSelectingAll,
}: ProductSelectorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Select Products</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b space-y-4">
          <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />
          <SelectAllButton isSelectingAll={isSelectingAll} onToggleSelectAll={onToggleSelectAll} />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 p-4">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products?.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onProductSelect(product.id)}
                  className="border rounded-lg p-4 cursor-pointer hover:border-primary relative"
                >
                  <div className="aspect-square mb-2">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <p className="font-medium">{product.name}</p>
                  {selectedProducts.includes(product.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-center gap-2">
            {Array.from({ length: Math.ceil((products?.length || 0) / PRODUCTS_PER_PAGE) }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}