import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CartHeaderProps {
  onClose: () => void;
}

export const CartHeader = ({ onClose }: CartHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Shopping Cart</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close cart">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};