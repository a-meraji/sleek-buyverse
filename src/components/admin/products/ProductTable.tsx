import { Table, TableBody } from "@/components/ui/table";
import { ProductTableRow } from "./ProductTableRow";
import { ProductTableHeader } from "./ProductTableHeader";
import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";

interface ProductTableProps {
  products: Product[] | null;
  productVariants: ProductVariant[] | null;
  expandedProductId: string | null;
  onExpand: (productId: string | null) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ 
  products, 
  productVariants,
  expandedProductId,
  onExpand,
  onEdit,
  onDelete 
}: ProductTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <ProductTableHeader />
        <TableBody>
          {products?.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              variants={productVariants?.filter(v => v.product_id === product.id) || []}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedProductId={expandedProductId}
              onExpand={onExpand}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}