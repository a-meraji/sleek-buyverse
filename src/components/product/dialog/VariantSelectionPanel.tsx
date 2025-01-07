import { Badge } from "@/components/ui/badge";
import { ColorSelector } from "../ColorSelector";
import { SizeSelector } from "../SizeSelector";
import { ProductVariant } from "@/types";

interface VariantSelectionPanelProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  finalSelectedVariantPrice: number;
  showOutOfStock?: boolean;
}

export const VariantSelectionPanel = ({
  colors,
  selectedColor,
  onColorSelect,
  selectedSize,
  onSizeSelect,
  variants,
  selectedVariant,
  finalSelectedVariantPrice,
  showOutOfStock = false,
}: VariantSelectionPanelProps) => {
  return (
    <>
      <ColorSelector
        colors={colors}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
      />

      <SizeSelector 
        selectedSize={selectedSize} 
        onSizeSelect={onSizeSelect}
        variants={variants.filter(v => v.color === selectedColor)}
        showOutOfStock={showOutOfStock}
      />
      
      {selectedVariant && (
        <div className="space-y-2">
          <p className="text-lg font-medium">
            Selected variant: ${finalSelectedVariantPrice.toFixed(2)}
          </p>
        </div>
      )}
    </>
  );
};