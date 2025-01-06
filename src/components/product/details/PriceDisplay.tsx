interface PriceDisplayProps {
  hasValidDiscount: boolean;
  discountedPrice: number;
  minPrice: number;
}

export const PriceDisplay = ({ hasValidDiscount, discountedPrice, minPrice }: PriceDisplayProps) => {
  // Format prices to 2 decimal places and ensure they're numbers
  const formattedDiscountPrice = Number(discountedPrice).toFixed(2);
  const formattedMinPrice = Number(minPrice).toFixed(2);

  return (
    <div className="space-y-1">
      {hasValidDiscount ? (
        <>
          <p className="text-xl text-red-500">From ${formattedDiscountPrice}</p>
          <p className="text-gray-500 line-through">From ${formattedMinPrice}</p>
        </>
      ) : (
        <p className="text-xl">From ${formattedMinPrice}</p>
      )}
    </div>
  );
};