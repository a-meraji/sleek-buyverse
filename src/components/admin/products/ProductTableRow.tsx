import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";

interface ProductTableRowProps {
  product: Product;
  variants: ProductVariant[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTableRow({ 
  product, 
  variants, 
  onEdit, 
  onDelete 
}: ProductTableRowProps) {
  const minPrice = variants.length 
    ? Math.min(...variants.map(v => v.price))
    : 0;
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

  return (
    <TableRow>
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
        <div className="flex flex-wrap gap-1">
          {variants.map((variant) => (
            <Badge key={`${variant.id}`} variant="secondary">
              {variant.color} - {variant.size} (${variant.price})
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>{totalStock}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(product)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}