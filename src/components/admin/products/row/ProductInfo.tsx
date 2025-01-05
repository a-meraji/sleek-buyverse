import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";

interface ProductInfoProps {
  name: string;
  discount?: number | null;
}

export function ProductInfo({ name, discount }: ProductInfoProps) {
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;

  return (
    <TableCell>
      <div className="flex items-center gap-2">
        {name}
        {hasValidDiscount && (
          <Badge className="bg-red-500 text-white">
            <Percent className="h-3 w-3 mr-1" />
            {discount}% OFF
          </Badge>
        )}
      </div>
    </TableCell>
  );
}