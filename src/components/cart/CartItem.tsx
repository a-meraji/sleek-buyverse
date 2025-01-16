import { CartItemProps } from "@/types";
import { CartItemHeader } from "./item/CartItemHeader";
import { CartItemImage } from "./item/CartItemImage";
import { CartItemPrice } from "./item/CartItemPrice";
import { CartItemQuantity } from "./item/CartItemQuantity";

export const CartItem = ({ 
  item, 
  onQuantityChange, 
  onRemove,
  readonly = false 
}: CartItemProps) => {
  if (!item.product) return null;

  const handleQuantityChange = (delta: number) => {
    onQuantityChange(item.id, item.quantity, delta);
  };

  const variantParams = item.variant?.parameters || {};
  const variantText = Object.entries(variantParams)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  const variantPrice = item.variant?.price || item.product.price;

  return (
    <div className="flex gap-4 py-4 border-b">
      <CartItemImage
        imageUrl={item.product.image_url}
        productName={item.product.name}
        discount={item.product.discount}
      />
      <div className="flex-1 space-y-2">
        <CartItemHeader
          productName={item.product.name}
          onRemove={() => onRemove(item.id)}
          readonly={readonly}
        />
        {variantText && (
          <p className="text-sm text-muted-foreground">
            {variantText}
          </p>
        )}
        <div className="flex items-center justify-between">
          {!readonly && (
            <CartItemQuantity
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
            />
          )}
          <CartItemPrice
            variantPrice={variantPrice}
            quantity={item.quantity}
            discount={item.product.discount}
          />
        </div>
      </div>
    </div>
  );
};