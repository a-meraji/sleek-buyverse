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
          value={selectedProduct || "all"}
          onValueChange={(value) => onProductChange(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by product" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border shadow-md">
            <SelectItem value="all">All Products</SelectItem>
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
          value={selectedStatus || "all"}
          onValueChange={(value) => onStatusChange(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border shadow-md">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}