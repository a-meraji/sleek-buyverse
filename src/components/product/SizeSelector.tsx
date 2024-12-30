import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SizeSelectorProps {
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  variants?: { size: string; stock: number }[];
}

export const SizeSelector = ({ selectedSize, onSizeSelect, variants = [] }: SizeSelectorProps) => {
  const isOutOfStock = (size: string) => {
    const variant = variants.find(v => v.size === size);
    return variant ? variant.stock <= 0 : true;
  };

  const currentVariantStock = variants.find(v => v.size === selectedSize)?.stock || 0;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Select Size</h3>
      <div className="flex gap-2">
        {variants.map((variant) => (
          <Button
            key={variant.size}
            variant={selectedSize === variant.size ? "default" : "outline"}
            onClick={() => onSizeSelect(variant.size)}
            className={variant.stock <= 0 ? "opacity-50" : ""}
          >
            {variant.size}
          </Button>
        ))}
      </div>
      {selectedSize && currentVariantStock <= 0 && (
        <Badge variant="destructive" className="mt-2">
          Out of Stock
        </Badge>
      )}
    </div>
  );
};