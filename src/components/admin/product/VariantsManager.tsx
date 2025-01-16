import { useState } from "react";
import { Plus, X, MinusCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
  const [definedParameters, setDefinedParameters] = useState<string[]>([]);

  const handleAddParameter = () => {
    if (!newParameterKey.trim()) return;
    
    const paramKey = newParameterKey.trim().toLowerCase();
    if (definedParameters.includes(paramKey)) {
      console.log('Parameter already exists');
      return;
    }
    
    setDefinedParameters(prev => [...prev, paramKey]);
    setNewParameterKey("");
    
    // Initialize the parameter value for all existing variants
    const updatedVariants = variants.map(variant => ({
      ...variant,
      parameters: {
        ...variant.parameters,
        [paramKey]: ""
      }
    }));
    onChange(updatedVariants);
  };

  const handleRemoveParameter = (paramKey: string) => {
    setDefinedParameters(prev => prev.filter(key => key !== paramKey));
    
    // Remove the parameter from all variants
    const updatedVariants = variants.map(variant => {
      const { [paramKey]: removed, ...remainingParams } = variant.parameters;
      return {
        ...variant,
        parameters: remainingParams
      };
    });
    onChange(updatedVariants);
  };

  const handleAddVariant = () => {
    if (definedParameters.length === 0) {
      console.log('No parameters defined');
      return;
    }

    const newParameters = definedParameters.reduce((acc, key) => ({
      ...acc,
      [key]: ""
    }), {});

    const newVariant: ProductVariant = {
      id: `temp-${Date.now()}`,
      product_id: productId || "",
      parameters: newParameters,
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

  const handleUpdateVariant = (variantId: string, field: string, value: string | number) => {
    onChange(
      variants.map(v => {
        if (v.id === variantId) {
          if (field === 'stock' || field === 'price') {
            return { ...v, [field]: Number(value) };
          } else {
            return {
              ...v,
              parameters: {
                ...v.parameters,
                [field]: value
              }
            };
          }
        }
        return v;
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Product Variants</h3>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="New parameter name (e.g., Size, Color, Weight)"
            value={newParameterKey}
            onChange={(e) => setNewParameterKey(e.target.value)}
            className="max-w-xs"
          />
          <Button 
            type="button" 
            onClick={handleAddParameter} 
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Parameter
          </Button>
        </div>

        {definedParameters.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {definedParameters.map(param => (
              <Badge 
                key={param} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {param}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => handleRemoveParameter(param)}
                >
                  <MinusCircle className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {definedParameters.length > 0 && (
          <>
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
                          onChange={(e) => handleUpdateVariant(variant.id, param, e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleUpdateVariant(variant.id, 'stock', e.target.value)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleUpdateVariant(variant.id, 'price', e.target.value)}
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
          </>
        )}
      </div>
    </div>
  );
}