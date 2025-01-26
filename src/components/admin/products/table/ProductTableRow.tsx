import React from 'react';
import { Product } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { ProductActionsCell } from './ProductActionsCell';
import { ProductVariantsCell } from './ProductVariantsCell';

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  expandedProductId: string | null;
  onExpand: (productId: string | null) => void;
}

export function ProductTableRow({ 
  product, 
  onEdit, 
  onDelete,
  expandedProductId,
  onExpand 
}: ProductTableRowProps) {
  const isExpanded = expandedProductId === product.id;

  return (
    <TableRow>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.sku}</TableCell>
      <TableCell>{product.main_category}</TableCell>
      <ProductVariantsCell 
        variants={product.product_variants || []}
        isExpanded={isExpanded}
        onExpand={() => onExpand(isExpanded ? null : product.id)}
      />
      <ProductActionsCell 
        product={product}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </TableRow>
  );
}