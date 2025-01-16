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
          <p className="text-red-500" aria-label={`Discounted price: $${discountedPrice.toFixed(2)} × ${quantity} = $${subtotal.toFixed(2)}`}>
            ${discountedPrice.toFixed(2)} × {quantity} = ${subtotal.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground line-through" aria-label={`Original price: $${variantPrice.toFixed(2)} × ${quantity} = $${(variantPrice * quantity).toFixed(2)}`}>
            ${variantPrice.toFixed(2)} × {quantity} = ${(variantPrice * quantity).toFixed(2)}
          </p>
        </>
      ) : (
        <p aria-label={`Price: $${variantPrice.toFixed(2)} × ${quantity} = $${subtotal.toFixed(2)}`}>
          ${variantPrice.toFixed(2)} × {quantity} = ${subtotal.toFixed(2)}
        </p>
      )}
    </div>
  );
};