interface PriceDisplayProps {
  hasValidDiscount: boolean;
  discountedPrice: number;
  minPrice: number;
}

export const PriceDisplay = ({ hasValidDiscount, discountedPrice, minPrice }: PriceDisplayProps) => {
  return (
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
  );
};