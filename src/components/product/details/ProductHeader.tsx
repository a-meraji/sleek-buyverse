import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";

interface ProductHeaderProps {
  name: string;
  discount?: number | null;
}

export const ProductHeader = ({ name, discount }: ProductHeaderProps) => {
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{name}</h1>
      {hasValidDiscount && (
        <Badge className="bg-red-500 text-white">
          <Percent className="h-4 w-4 mr-1" />
          {discount}% OFF
        </Badge>
      )}
    </div>
  );
};