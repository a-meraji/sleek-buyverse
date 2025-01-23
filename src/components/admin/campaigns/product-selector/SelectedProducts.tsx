import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Product } from "@/types";

interface SelectedProductsProps {
  products: Product[];
  selectedProducts: string[];
  onRemove: (productId: string) => void;
}

export function SelectedProducts({ products, selectedProducts, onRemove }: SelectedProductsProps) {
  const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));

  if (selectedProducts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedProductsData.map(product => (
        <Badge
          key={product.id}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {product.name}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onRemove(product.id)}
          />
        </Badge>
      ))}
    </div>
  );
}