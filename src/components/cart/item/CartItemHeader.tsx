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
        <h3 className="font-medium text-gray-900">{productName}</h3>
        {parameters && (
          <p className="text-sm text-gray-500 mt-1">{parameters}</p>
        )}
      </div>
      {!readonly && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};