import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { ProductVariantsCell } from "./table/ProductVariantsCell";
import { ProductActionsCell } from "./table/ProductActionsCell";

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
      <ProductVariantsCell
        variants={variants}
        isExpanded={isExpanded}
        onExpand={() => onExpand(isExpanded ? null : product.id)}
      />
      <TableCell>{totalStock}</TableCell>
      <ProductActionsCell
        product={product}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </TableRow>
  );
}