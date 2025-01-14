import { CartItem, Product, ProductVariant } from "@/types";

interface OrderItemProps {
  item: CartItem & { product?: Product };
}

export const OrderItem = ({ item }: OrderItemProps) => {
  const variant = item.product?.product_variants?.find(v => v.id === item.variant_id);
  const variantPrice = variant?.price ?? 0;
  const discount = item.product?.discount;
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
  const subtotal = discountedPrice * item.quantity;

  return (
    <div className="flex justify-between p-4 bg-secondary rounded-lg">
      <div>
        <h3 className="font-medium">{item.product?.name}</h3>
        <p className="text-sm text-muted-foreground">
          Size: {variant?.size}, Color: {variant?.color}
        </p>
        <p className="text-sm">Quantity: {item.quantity}</p>
      </div>
      <div className="text-right">
        {hasValidDiscount ? (
          <>
            <p className="text-sm text-muted-foreground line-through">
              ${variantPrice.toFixed(2)} × {item.quantity}
            </p>
            <p className="text-red-500">
              ${discountedPrice.toFixed(2)} × {item.quantity}
            </p>
            <p className="font-medium text-red-500">
              ${subtotal.toFixed(2)}
            </p>
          </>
        ) : (
          <>
            <p>${variantPrice.toFixed(2)} × {item.quantity}</p>
            <p className="font-medium">${subtotal.toFixed(2)}</p>
          </>
        )}
      </div>
    </div>
  );
};