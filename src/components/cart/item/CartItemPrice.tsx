interface CartItemPriceProps {
  variantPrice: number;
  quantity: number;
  discount?: number | null;
}

export const CartItemPrice = ({ variantPrice, quantity, discount }: CartItemPriceProps) => {
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
  const subtotal = discountedPrice * quantity;

  return (
    <div className="space-y-1">
      {hasValidDiscount ? (
        <>
          <p className="text-red-500">${discountedPrice.toFixed(2)} × {quantity} = ${subtotal.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground line-through">
            ${variantPrice.toFixed(2)} × {quantity} = ${(variantPrice * quantity).toFixed(2)}
          </p>
        </>
      ) : (
        <p>${variantPrice.toFixed(2)} × {quantity} = ${subtotal.toFixed(2)}</p>
      )}
    </div>
  );
};