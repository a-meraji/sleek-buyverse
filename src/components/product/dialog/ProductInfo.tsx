import { ProductVariant } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";

interface ProductInfoProps {
  name: string;
  variants?: ProductVariant[];
  discount?: number | null;
}

export function ProductInfo({ name, variants = [], discount }: ProductInfoProps) {
  // Calculate the minimum price from variants
  const minPrice = variants?.length 
    ? Math.min(...variants.map(v => v.price))
    : 0;

  // Calculate discounted price if discount exists and is valid
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? minPrice * (1 - discount / 100) : minPrice;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium">{name}</h3>
        {hasValidDiscount && (
          <Badge className="bg-red-500 text-white">
            {discount}% OFF
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        {hasValidDiscount ? (
          <>
            <p className="text-xl text-red-500">From ${discountedPrice.toFixed(2)}</p>
            <p className="text-gray-500 line-through">From ${minPrice.toFixed(2)}</p>
          </>
        ) : (
          <p className="text-xl">From ${minPrice.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}