import { Product } from "@/types";
import { ProductSelector } from "./filters/ProductSelector";
import { StatusSelector } from "./filters/StatusSelector";

interface ReviewFiltersProps {
  products: Pick<Product, "id" | "name">[];
  selectedProduct: string | null;
  onProductChange: (value: string | null) => void;
  selectedStatus: string | null;
  onStatusChange: (value: string | null) => void;
}

export function ReviewFilters({
  products = [],
  selectedProduct,
  onProductChange,
  selectedStatus,
  onStatusChange,
}: ReviewFiltersProps) {
  return (
    <div className="space-y-4">
      <ProductSelector
        products={products}
        selectedProduct={selectedProduct}
        onProductChange={onProductChange}
      />
      
      <div className="flex gap-4">
        <div className="w-[200px]">
          <ProductSelector
            products={products}
            selectedProduct={selectedProduct}
            onProductChange={onProductChange}
          />
        </div>

        <div className="w-[200px]">
          <StatusSelector
            selectedStatus={selectedStatus}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  );
}