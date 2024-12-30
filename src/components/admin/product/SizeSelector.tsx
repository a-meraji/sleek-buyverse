import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProductSize } from "@/types";

interface SizeSelectorProps {
  selectedSizes: ProductSize[];
  onChange: (sizes: ProductSize[]) => void;
}

export function SizeSelector({ selectedSizes, onChange }: SizeSelectorProps) {
  const availableSizes: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', '20', '22', '23'];

  const handleSizeToggle = (size: ProductSize) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    onChange(newSizes);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sizes</label>
      <div className="grid grid-cols-3 gap-4">
        {availableSizes.map((size) => (
          <div key={size} className="flex items-center space-x-2">
            <Checkbox
              id={`size-${size}`}
              checked={selectedSizes.includes(size)}
              onCheckedChange={() => handleSizeToggle(size)}
            />
            <Label htmlFor={`size-${size}`}>{size}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}