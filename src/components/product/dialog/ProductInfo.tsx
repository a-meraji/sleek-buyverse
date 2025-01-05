import { ProductVariant } from "@/types/variant";

interface ProductInfoProps {
  name: string;
  variants?: ProductVariant[];
  discount?: number | null;
}

export function ProductInfo({ name, variants, discount }: ProductInfoProps) {
  const minPrice = variants?.length 
    ? Math.min(...variants.map(v => v.price))
    : null;

  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount && minPrice !== null 
    ? minPrice * (1 - discount / 100) 
    : minPrice;

  return (
    <>
      <h3 className="text-lg font-medium">{name}</h3>
      {minPrice !== null && (
        <p className="text-sm">
          {hasValidDiscount ? (
            <span className="flex items-center gap-2">
              <span className="text-gray-500 line-through">From ${minPrice.toFixed(2)}</span>
              <span className="text-red-500">From ${discountedPrice.toFixed(2)}</span>
            </span>
          ) : (
            <span className="text-gray-500">From ${minPrice.toFixed(2)}</span>
          )}
        </p>
      )}
    </>
  );
}