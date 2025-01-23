import { Search, X, Check } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";

interface ProductSelectorModalProps {
  products: Product[] | null;
  selectedProducts: string[];
  onToggleProduct: (productId: string) => void;
  onClose: () => void;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  PRODUCTS_PER_PAGE: number;
  onToggleSelectAll: () => void;
  isSelectingAll: boolean;
}

export function ProductSelectorModal({
  products,
  selectedProducts,
  onToggleProduct,
  onClose,
  isLoading,
  searchTerm,
  onSearchChange,
  currentPage,
  onPageChange,
  PRODUCTS_PER_PAGE,
  onToggleSelectAll,
  isSelectingAll,
}: ProductSelectorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Products</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={onToggleSelectAll}
            variant={isSelectingAll ? "default" : "outline"}
            className="w-full"
          >
            {isSelectingAll ? "Deselect All Products" : "Select All Products"}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {products?.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onToggleProduct(product.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedProducts.includes(product.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                  <div className="w-6">
                    {selectedProducts.includes(product.id) && (
                      <Check className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!products || products.length < PRODUCTS_PER_PAGE}
            className={`px-4 py-2 rounded ${
              !products || products.length < PRODUCTS_PER_PAGE
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}