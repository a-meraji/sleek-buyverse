import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <label htmlFor="price" className="text-sm font-medium cursor-help">
              Price ($)
            </label>
          </TooltipTrigger>
          <TooltipContent>
            <p>Set the base price for this product</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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