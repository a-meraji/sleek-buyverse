import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartHeaderProps {
  onClose: () => void;
}

export function CartHeader({ onClose }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">Shopping Cart</h2>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
}