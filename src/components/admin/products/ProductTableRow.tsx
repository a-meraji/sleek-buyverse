import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { cn } from "@/lib/utils";

interface ProductTableRowProps {
  product: Product;
  variants: ProductVariant[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  expandedProductId: string | null;
  onExpand: (productId: string | null) => void;
}

export function ProductTableRow({ 
  product, 
  variants, 
  onEdit, 
  onDelete,
  expandedProductId,
  onExpand
}: ProductTableRowProps) {
  const minPrice = variants.length 
    ? Math.min(...variants.map(v => v.price))
    : 0;
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
  
  const isExpanded = expandedProductId === product.id;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExpand(isExpanded ? null : product.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(product);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(product);
  };

  return (
    <TableRow className="cursor-default">
      <TableCell>
        <img
          src={product.image_url}
          alt={product.name}
          className="h-12 w-12 object-cover rounded"
        />
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.sku}</TableCell>
      <TableCell>${minPrice.toFixed(2)}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>
        <div className="relative">
          <div 
            className={cn(
              "flex flex-wrap gap-1 transition-all duration-300",
              !isExpanded && "max-h-8 overflow-hidden"
            )}
          >
            {variants.map((variant) => (
              <Badge 
                key={`${variant.id}`} 
                variant="secondary"
                className="whitespace-nowrap"
              >
                {variant.color} - {variant.size} (${variant.price})
              </Badge>
            ))}
          </div>
          {variants.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpandClick}
              className="absolute -bottom-2 right-0 h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell>{totalStock}</TableCell>
      <TableCell>
        <div className="flex gap-2 relative z-10">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEditClick}
            className="relative z-20"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteClick}
            className="relative z-20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}