import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Filtered products:", filteredProducts);

  return (
    <div className="space-y-4">
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
              <div className="px-2 py-2">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
              </div>
              <SelectItem value="all">All Products</SelectItem>
              {filteredProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
              {filteredProducts.length === 0 && (
                <div className="px-2 py-2 text-sm text-gray-500">
                  No products found
                </div>
              )}
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
    </div>
  );
}