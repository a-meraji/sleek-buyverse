import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { ProductImage } from "./row/ProductImage";
import { ProductInfo } from "./row/ProductInfo";
import { ProductVariants } from "./row/ProductVariants";
import { ProductActions } from "./row/ProductActions";

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
    <TableRow>
      <ProductImage imageUrl={product.image_url} productName={product.name} />
      <ProductInfo name={product.name} discount={product.discount} />
      <TableCell>{product.sku}</TableCell>
      <TableCell>${minPrice.toFixed(2)}</TableCell>
      <TableCell>{product.category}</TableCell>
      <ProductVariants 
        variants={variants}
        isExpanded={isExpanded}
        onExpand={handleExpandClick}
      />
      <TableCell>{totalStock}</TableCell>
      <ProductActions 
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </TableRow>
  );
}