import { Input } from "@/components/ui/input";

interface PriceStockFieldsProps {
  price: number;
  stock: number;
  onPriceChange: (value: number) => void;
  onStockChange: (value: number) => void;
}

export function PriceStockFields({
  price,
  stock,
  onPriceChange,
  onStockChange,
}: PriceStockFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
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

      <div className="space-y-2">
        <label htmlFor="stock" className="text-sm font-medium">Stock</label>
        <Input
          id="stock"
          type="number"
          min="0"
          value={stock}
          onChange={(e) => onStockChange(Number(e.target.value))}
          required
        />
      </div>
    </div>
  );
}