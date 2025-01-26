import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { ProductActionsCell } from './ProductActionsCell';
import { ProductVariantsCell } from './ProductVariantsCell';
import { ProductTableRowProps } from '@/types';
import { Badge } from '@/components/ui/badge';

export function ProductTableRow({ 
  product, 
  variants,
  onEdit, 
  onDelete,
  expandedProductId,
  onExpand 
}: ProductTableRowProps) {
  const isExpanded = expandedProductId === product.id;
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

  return (
    <TableRow>
      <TableCell>
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-12 h-12 object-cover rounded"
        />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.sku}</TableCell>
      <TableCell>
        <div className="space-y-2">
          <div>{product.main_category || 'No main category'}</div>
          <div className="flex flex-wrap gap-1">
            {product.secondary_categories?.map((category, index) => (
              <Badge key={index} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <ProductVariantsCell 
          variants={variants}
          isExpanded={isExpanded}
          onExpand={() => onExpand(isExpanded ? null : product.id)}
        />
      </TableCell>
      <TableCell>{totalStock}</TableCell>
      <TableCell>
        <ProductActionsCell 
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}