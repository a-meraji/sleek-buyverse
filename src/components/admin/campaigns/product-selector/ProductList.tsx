import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  selectedProducts: string[];
  onToggleProduct: (productId: string) => void;
}

export function ProductList({ products, selectedProducts, onToggleProduct }: ProductListProps) {
  return (
    <ScrollArea className="h-72">
      <div className="space-y-1 p-1">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onToggleProduct(product.id)}
            className={cn(
              "w-full flex items-center space-x-2 px-3 py-2 rounded-sm text-sm hover:bg-accent",
              selectedProducts.includes(product.id) && "bg-accent"
            )}
          >
            <div className="flex-shrink-0 w-8 h-8">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <span className="flex-grow text-left">{product.name}</span>
            <Check
              className={cn(
                "h-4 w-4",
                selectedProducts.includes(product.id) ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}