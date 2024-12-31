import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VariantPriceFieldProps {
  price: number;
  onChange: (price: number) => void;
}

export function VariantPriceField({ price, onChange }: VariantPriceFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="price">Price ($)</Label>
      <Input
        id="price"
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => onChange(Number(e.target.value))}
        required
      />
    </div>
  );
}