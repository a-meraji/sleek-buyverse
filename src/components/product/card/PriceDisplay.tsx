import { ProductVariant } from "@/types";

interface PriceDisplayProps {
  variants?: ProductVariant[];
  discount?: number | null;
}

export const PriceDisplay = ({ variants, discount }: PriceDisplayProps) => {
  const minPrice = variants?.length 
    ? Math.min(...variants.map(v => v.price))
    : 0;

  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? minPrice * (1 - discount / 100) : minPrice;

  return (
    <p className="mt-1 text-sm">
      {variants?.length ? (
        <span className="flex items-center gap-2">
          {hasValidDiscount ? (
            <>
              <span className="text-gray-500 line-through">From ${minPrice.toFixed(2)}</span>
              <span className="text-red-500">From ${discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-gray-500">From ${minPrice.toFixed(2)}</span>
          )}
        </span>
      ) : (
        "Price not available"
      )}
    </p>
  );
};