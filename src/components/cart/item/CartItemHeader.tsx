import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CartItemHeaderProps {
  productName: string;
  onRemove: () => void;
  readonly?: boolean;
}

export const CartItemHeader = ({ productName, onRemove, readonly = false }: CartItemHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-medium">{productName}</h3>
      {!readonly && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};