import { ProductVariant } from "@/types/variant";

interface ProductInfoProps {
  name: string;
  variants?: ProductVariant[];
}

export function ProductInfo({ name, variants }: ProductInfoProps) {
  const minPrice = variants?.length 
    ? Math.min(...variants.map(v => v.price))
    : null;

  return (
    <>
      <h3 className="text-lg font-medium">{name}</h3>
      {minPrice !== null && (
        <p className="text-sm text-gray-500">From ${minPrice.toFixed(2)}</p>
      )}
    </>
  );
}