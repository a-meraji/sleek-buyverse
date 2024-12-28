import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

export const SizeSelector = ({ selectedSize, onSizeSelect }: SizeSelectorProps) => {
  // Temporary sizes array since it's not in the database
  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Select Size</h3>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            onClick={() => onSizeSelect(size)}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};