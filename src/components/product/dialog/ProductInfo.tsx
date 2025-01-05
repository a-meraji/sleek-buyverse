import { ProductVariant } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
  name: string;
  variants?: ProductVariant[];
  discount?: number | null;
  selectedVariant?: ProductVariant | null;
}

export function ProductInfo({ name, variants = [], discount, selectedVariant }: ProductInfoProps) {
  // Calculate the minimum price from variants
  const minPrice = variants?.length 
    ? Math.min(...variants.map(v => v.price))
    : 0;

  // Calculate discounted price if discount exists and is valid
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  
  // Use selected variant price if available, otherwise use minPrice
  const basePrice = selectedVariant ? selectedVariant.price : minPrice;
  const discountedPrice = hasValidDiscount ? basePrice * (1 - discount / 100) : basePrice;

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
            <p className="text-xl text-red-500">
              {selectedVariant ? '$' : 'From $'}
              {discountedPrice.toFixed(2)}
            </p>
            <p className="text-gray-500 line-through">
              {selectedVariant ? '$' : 'From $'}
              {basePrice.toFixed(2)}
            </p>
          </>
        ) : (
          <p className="text-xl">
            {selectedVariant ? '$' : 'From $'}
            {basePrice.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}