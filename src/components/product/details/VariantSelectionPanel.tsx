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
}: VariantSelectionPanelProps) => {
  const isOutOfStock = selectedVariant?.stock <= 0;

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
      />
      
      {selectedVariant && (
        <div className="space-y-2">
          {selectedVariant.price !== finalSelectedVariantPrice ? (
            <>
              <p className="text-lg font-medium text-red-500">
                ${finalSelectedVariantPrice.toFixed(2)}
              </p>
              <p className="text-gray-500 line-through">
                ${selectedVariant.price.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-lg font-medium">
              ${selectedVariant.price.toFixed(2)}
            </p>
          )}
          {isOutOfStock && (
            <Badge variant="destructive" className="w-fit">
              Out of Stock
            </Badge>
          )}
        </div>
      )}
    </>
  );
};