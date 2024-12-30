import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductVariant } from "@/types/product";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VariantsManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  productId?: string;
}

export function VariantsManager({ variants, onChange, productId }: VariantsManagerProps) {
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newStock, setNewStock] = useState(0);

  const handleAddVariant = () => {
    if (!newSize || !newColor) return;

    // Check for duplicate variant
    const isDuplicate = variants.some(
      v => v.size.toLowerCase() === newSize.toLowerCase() && 
           v.color.toLowerCase() === newColor.toLowerCase()
    );

    if (isDuplicate) {
      console.log('Duplicate variant combination');
      return;
    }

    const newVariant: ProductVariant = {
      id: `temp-${Date.now()}`, // Will be replaced with real ID from database
      product_id: productId || "",
      size: newSize,
      color: newColor,
      stock: newStock
    };

    onChange([...variants, newVariant]);
    setNewSize("");
    setNewColor("");
    setNewStock(0);
  };

  const handleRemoveVariant = (variantToRemove: ProductVariant) => {
    onChange(variants.filter(v => v.id !== variantToRemove.id));
  };

  const handleUpdateStock = (variantId: string, newStock: number) => {
    onChange(
      variants.map(v => 
        v.id === variantId ? { ...v, stock: newStock } : v
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Product Variants</h3>
        
        <div className="grid grid-cols-4 gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  placeholder="Size"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter the size for this variant (e.g., S, M, L, 42, etc.)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  placeholder="Color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter the color for this variant (e.g., Red, Blue, etc.)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Input
            type="number"
            min="0"
            placeholder="Stock"
            value={newStock}
            onChange={(e) => setNewStock(Number(e.target.value))}
          />

          <Button type="button" onClick={handleAddVariant}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((variant) => (
            <TableRow key={variant.id}>
              <TableCell>{variant.size}</TableCell>
              <TableCell>{variant.color}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => handleUpdateStock(variant.id, Number(e.target.value))}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveVariant(variant)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}