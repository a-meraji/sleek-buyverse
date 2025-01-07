import { Badge } from "@/components/ui/badge";
import { ColorSelector } from "../ColorSelector";
import { SizeSelector } from "../SizeSelector";
import { ProductVariant } from "@/types";

interface VariantSelectionPanelProps {
  variants: ProductVariant[];
  selectedSize: string;
  selectedColor: string;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
  showOutOfStock?: boolean;
}

export const VariantSelectionPanel = ({
  variants,
  selectedSize,
  selectedColor,
  onSizeSelect,
  onColorSelect,
  showOutOfStock = false,
}: VariantSelectionPanelProps) => {
  // Get unique colors from variants
  const colors = Array.from(new Set(variants.map(v => v.color)));

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
    </>
  );
};