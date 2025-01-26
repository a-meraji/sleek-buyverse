import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface CartItemQuantityProps {
  quantity: number;
  onQuantityChange: (delta: number) => void;
}

export const CartItemQuantity = ({ quantity, onQuantityChange }: CartItemQuantityProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onQuantityChange(-1)}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center">{quantity}</span>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onQuantityChange(1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};