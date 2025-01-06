import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types";

interface ReviewFiltersProps {
  products: Pick<Product, "id" | "name">[];
  selectedProduct: string | null;
  onProductChange: (value: string | null) => void;
  selectedStatus: string | null;
  onStatusChange: (value: string | null) => void;
}

export function ReviewFilters({
  products,
  selectedProduct,
  onProductChange,
  selectedStatus,
  onStatusChange,
}: ReviewFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="w-[200px]">
        <Select
          value={selectedProduct || ""}
          onValueChange={(value) => onProductChange(value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Select
          value={selectedStatus || ""}
          onValueChange={(value) => onStatusChange(value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}