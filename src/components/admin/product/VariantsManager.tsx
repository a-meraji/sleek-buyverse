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
import { ProductVariant } from "@/types/variant";
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
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [newParameterKey, setNewParameterKey] = useState("");
  const [newStock, setNewStock] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  const handleAddVariant = () => {
    if (Object.keys(parameters).length === 0) {
      console.log('No parameters defined');
      return;
    }

    const isDuplicate = variants.some(v => {
      return Object.entries(parameters).every(
        ([key, value]) => v.parameters[key]?.toString().toLowerCase() === value.toLowerCase()
      );
    });

    if (isDuplicate) {
      console.log('Duplicate variant combination');
      return;
    }

    const newVariant: ProductVariant = {
      id: `temp-${Date.now()}`,
      product_id: productId || "",
      parameters: parameters,
      stock: newStock,
      price: newPrice,
      created_at: new Date().toISOString()
    };

    onChange([...variants, newVariant]);
    setParameters({});
    setNewStock(0);
    setNewPrice(0);
  };

  const handleRemoveVariant = (variantToRemove: ProductVariant) => {
    onChange(variants.filter(v => v.id !== variantToRemove.id));
  };

  const handleUpdateVariant = (variantId: string, updates: Partial<ProductVariant>) => {
    onChange(
      variants.map(v => 
        v.id === variantId ? { ...v, ...updates } : v
      )
    );
  };

  const handleAddParameter = () => {
    if (!newParameterKey.trim()) return;
    setParameters(prev => ({
      ...prev,
      [newParameterKey.trim()]: ""
    }));
    setNewParameterKey("");
  };

  const handleParameterValueChange = (key: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const parameterKeys = Array.from(
    new Set(variants.flatMap(v => Object.keys(v.parameters)))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Product Variants</h3>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="New parameter name (e.g., Material, Size, Color)"
            value={newParameterKey}
            onChange={(e) => setNewParameterKey(e.target.value)}
            className="max-w-xs"
          />
          <Button type="button" onClick={handleAddParameter} size="sm">
            Add Parameter
          </Button>
        </div>

        {Object.keys(parameters).length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(parameters).map(([key, value]) => (
              <div key={key} className="flex gap-2 items-center">
                <span className="min-w-[100px] font-medium">{key}:</span>
                <Input
                  value={value}
                  onChange={(e) => handleParameterValueChange(key, e.target.value)}
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              {parameterKeys.map(key => (
                <TableHead key={key} className="capitalize">{key}</TableHead>
              ))}
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {variants.length > 0 && (
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.id}>
                  {parameterKeys.map(key => (
                    <TableCell key={key}>
                      {variant.parameters[key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) => handleUpdateVariant(variant.id, { stock: Number(e.target.value) })}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => handleUpdateVariant(variant.id, { price: Number(e.target.value) })}
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
          )}
        </Table>
        
        {Object.keys(parameters).length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min="0"
              placeholder="Enter stock quantity"
              value={newStock}
              onChange={(e) => setNewStock(Number(e.target.value))}
            />

            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
            />

            <Button 
              type="button" 
              onClick={handleAddVariant}
              className="col-span-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}