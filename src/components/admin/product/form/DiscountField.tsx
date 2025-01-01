import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DiscountFieldProps {
  discount: number | null;
  onDiscountChange: (value: number | null) => void;
}

export function DiscountField({ discount, onDiscountChange }: DiscountFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="discount">Discount Percentage</Label>
      <Input
        id="discount"
        type="number"
        min="0"
        max="100"
        value={discount || ""}
        onChange={(e) => {
          const value = e.target.value ? parseInt(e.target.value, 10) : null;
          onDiscountChange(value);
        }}
        placeholder="Enter discount percentage (e.g., 15 for 15% off)"
      />
    </div>
  );
}