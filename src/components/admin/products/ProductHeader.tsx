import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductHeaderProps {
  onAddProduct: () => void;
}

export function ProductHeader({ onAddProduct }: ProductHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Products</h2>
      <Button onClick={onAddProduct}>
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </Button>
    </div>
  );
}