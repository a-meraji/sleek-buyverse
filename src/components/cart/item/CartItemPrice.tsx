import { CartItemPriceProps } from "@/types";

export const CartItemPrice = ({ variantPrice, quantity, discount }: CartItemPriceProps) => {
  if (typeof variantPrice !== 'number') {
    console.error('Invalid price:', { variantPrice });
    return null;
  }

  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
  const subtotal = discountedPrice * quantity;

  return (
    <div className="text-right">
      <div className="flex flex-col items-end">
        {hasValidDiscount ? (
          <>
            <span className="text-sm text-gray-500 line-through">
              ${variantPrice.toFixed(2)}
            </span>
            <span className="text-red-500">
              ${discountedPrice.toFixed(2)}
            </span>
          </>
        ) : (
          <span>${variantPrice.toFixed(2)}</span>
        )}
        {quantity > 1 && (
          <span className="text-sm text-gray-500">
            Subtotal: ${subtotal.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};