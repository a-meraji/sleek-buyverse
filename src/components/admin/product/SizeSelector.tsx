import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ProductSize } from "@/types";

interface SizeSelectorProps {
  selectedSizes: ProductSize[];
  onChange: (sizes: ProductSize[]) => void;
}

export function SizeSelector({ selectedSizes, onChange }: SizeSelectorProps) {
  const [newSize, setNewSize] = useState("");

  const handleAddSize = () => {
    if (newSize.trim() && !selectedSizes.includes(newSize.trim())) {
      onChange([...selectedSizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    onChange(selectedSizes.filter(size => size !== sizeToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSize();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sizes</label>
      <div className="flex gap-2">
        <Input
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add size (e.g., S, M, L, 42)"
          className="flex-1"
        />
        <Button type="button" onClick={handleAddSize}>
          Add Size
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedSizes.map((size) => (
          <Badge 
            key={size} 
            variant="secondary"
            className="flex items-center gap-1"
          >
            {size}
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