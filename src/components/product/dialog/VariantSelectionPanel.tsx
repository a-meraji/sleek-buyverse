import { ProductVariant } from "@/types/variant";
import { VariantSelector } from "./VariantSelector";
import { Badge } from "@/components/ui/badge";

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
  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = [...new Set(variants.map(v => v.color))];
  
  const selectedVariant = variants.find(v => 
    v.size === selectedSize && v.color === selectedColor
  );
  const isOutOfStock = selectedVariant?.stock <= 0;

  return (
    <div className="space-y-4">
      {variants.length > 0 ? (
        <>
          <VariantSelector
            label="Size"
            options={sizes}
            value={selectedSize}
            onChange={onSizeChange}
            variants={variants}
          />
          <VariantSelector
            label="Color"
            options={colors}
            value={selectedColor}
            onChange={onColorChange}
          />
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