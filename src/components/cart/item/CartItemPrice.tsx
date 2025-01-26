import { CartItemPriceProps } from "@/types";

export const CartItemPrice = ({ 
  price,
  quantity, 
  discount = 0,
  variantPrice
}: CartItemPriceProps) => {
  const hasDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
  const total = discountedPrice * quantity;

  return (
    <div className="text-right">
      <div className="font-medium text-gray-900">
        ${total.toFixed(2)}
      </div>
      {hasDiscount && (
        <div className="text-sm">
          <span className="text-gray-500 line-through mr-2">
            ${(variantPrice * quantity).toFixed(2)}
          </span>
          <span className="text-green-600">
            {discount}% off
          </span>
        </div>
      )}
    </div>
  );
};