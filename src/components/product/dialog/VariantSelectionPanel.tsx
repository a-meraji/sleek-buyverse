import { ProductVariant } from "@/types/variant";
import { VariantSelector } from "./VariantSelector";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface VariantSelectionPanelProps {
  variants: ProductVariant[];
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export function VariantSelectionPanel({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange
}: VariantSelectionPanelProps) {
  const colors = [...new Set(variants.map(v => v.color))];
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  
  useEffect(() => {
    if (selectedColor) {
      const sizes = variants
        .filter(v => v.color === selectedColor)
        .map(v => v.size);
      setAvailableSizes(sizes);
      if (!sizes.includes(selectedSize)) {
        onSizeChange('');
      }
    }
  }, [selectedColor, variants, selectedSize, onSizeChange]);

  const selectedVariant = variants.find(v => 
    v.size === selectedSize && v.color === selectedColor
  );
  const isOutOfStock = selectedVariant?.stock <= 0;

  return (
    <div className="space-y-4">
      {variants.length > 0 ? (
        <>
          <VariantSelector
            label="Color"
            options={colors}
            value={selectedColor}
            onChange={onColorChange}
          />
          {selectedColor && (
            <VariantSelector
              label="Size"
              options={availableSizes}
              value={selectedSize}
              onChange={onSizeChange}
              variants={variants.filter(v => v.color === selectedColor)}
            />
          )}
          {isOutOfStock && (
            <Badge variant="destructive" className="w-fit">
              Out of Stock
            </Badge>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500">
          No variants available for this product.
        </p>
      )}
    </div>
  );
}