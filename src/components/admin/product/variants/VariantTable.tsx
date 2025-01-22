import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ProductVariant } from "@/types/variant";

interface VariantTableProps {
  variants: ProductVariant[];
  definedParameters: string[];
  onUpdateVariant: (variantId: string, field: string, value: string | number) => void;
  onRemoveVariant: (variant: ProductVariant) => void;
}

export function VariantTable({
  variants,
  definedParameters,
  onUpdateVariant,
  onRemoveVariant,
}: VariantTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {definedParameters.map(param => (
            <TableHead key={param} className="capitalize">{param}</TableHead>
          ))}
          <TableHead>Stock</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants.map((variant) => (
          <TableRow key={variant.id}>
            {definedParameters.map(param => (
              <TableCell key={param}>
                <Input
                  value={variant.parameters[param] || ""}
                  onChange={(e) => onUpdateVariant(variant.id, param, e.target.value)}
                  className="w-full"
                />
              </TableCell>
            ))}
            <TableCell>
              <Input
                type="number"
                min="0"
                value={variant.stock}
                onChange={(e) => onUpdateVariant(variant.id, 'stock', e.target.value)}
                className="w-24"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={variant.price}
                onChange={(e) => onUpdateVariant(variant.id, 'price', e.target.value)}
                className="w-24"
              />
            </TableCell>
            <TableCell>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveVariant(variant)}
              >
                <X className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}