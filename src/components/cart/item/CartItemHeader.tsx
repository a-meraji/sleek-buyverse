import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CartItemHeaderProps } from "@/types";

export const CartItemHeader = ({ 
  productName, 
  parameters,
  onRemove, 
  readonly = false 
}: CartItemHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">{productName}</h3>
        {parameters && (
          <p className="text-sm text-muted-foreground">{parameters}</p>
        )}
      </div>
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