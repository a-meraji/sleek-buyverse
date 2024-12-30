import { Input } from "@/components/ui/input";

interface PriceStockFieldsProps {
  price: number;
  onPriceChange: (value: number) => void;
}

export function PriceStockFields({
  price,
  onPriceChange,
}: PriceStockFieldsProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="price" className="text-sm font-medium">Price</label>
      <Input
        id="price"
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => onPriceChange(Number(e.target.value))}
        required
      />
    </div>
  );
}