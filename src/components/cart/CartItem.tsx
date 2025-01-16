import { CartItem as CartItemType } from "@/types";
import { CartItemImage } from "./item/CartItemImage";
import { CartItemHeader } from "./item/CartItemHeader";
import { CartItemPrice } from "./item/CartItemPrice";
import { CartItemQuantity } from "./item/CartItemQuantity";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  readonly?: boolean;
}

export const CartItem = ({
  item,
  updateQuantity,
  removeItem,
  readonly = false,
}: CartItemProps) => {
  if (!item.product) return null;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    } else {
      removeItem(item.id);
    }
  };

  const variantPrice = item.variant?.price || item.product.price;

  return (
    <div className="flex gap-4 py-4">
      <CartItemImage
        imageUrl={item.product.image_url}
        productName={item.product.name}
        discount={item.product.discount}
      />
      
      <div className="flex-1 space-y-2">
        <CartItemHeader
          productName={item.product.name}
          onRemove={() => removeItem(item.id)}
          readonly={readonly}
        />

        {item.variant && (
          <div className="text-sm text-muted-foreground">
            {Object.entries(item.variant.parameters).map(([key, value]) => (
              <span key={key} className="mr-4">
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        <CartItemPrice
          variantPrice={variantPrice}
          quantity={item.quantity}
          discount={item.product.discount}
        />

        {!readonly && (
          <CartItemQuantity
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
          />
        )}
      </div>
    </div>
  );
};