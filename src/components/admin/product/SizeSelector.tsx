import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ProductSize } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SizeSelectorProps {
  selectedSizes: ProductSize[];
  onChange: (sizes: ProductSize[]) => void;
}

export function SizeSelector({ selectedSizes, onChange }: SizeSelectorProps) {
  const [newSize, setNewSize] = useState("");

  const handleAddSizes = (sizesInput: string) => {
    const sizesToAdd = sizesInput
      .split(",")
      .map(size => size.trim())
      .filter(size => size !== "")
      .map(size => ({
        id: crypto.randomUUID(),
        name: size,
        value: size
      }));

    const uniqueNewSizes = sizesToAdd.filter(
      size => !selectedSizes.some(existing => existing.value === size.value)
    );

    if (uniqueNewSizes.length > 0) {
      onChange([...selectedSizes, ...uniqueNewSizes]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove: ProductSize) => {
    onChange(selectedSizes.filter(size => size.value !== sizeToRemove.value));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSizes(newSize);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSize(value);
    
    // If the last character is a comma, add the sizes
    if (value.endsWith(",")) {
      handleAddSizes(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sizes</label>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                value={newSize}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Add size (e.g., S, M, L, 42)"
                className="flex-1"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Type multiple sizes separated by commas (e.g., S, M, L)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button type="button" onClick={() => handleAddSizes(newSize)}>
          Add Size
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedSizes.map((size) => (
          <Badge 
            key={size.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {size.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveSize(size)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}