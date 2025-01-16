import { CartItemProps } from "@/types";
import { CartItemHeader } from "./item/CartItemHeader";
import { CartItemImage } from "./item/CartItemImage";
import { CartItemPrice } from "./item/CartItemPrice";
import { CartItemQuantity } from "./item/CartItemQuantity";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const CartItem = ({
  item,
  onQuantityChange,
  onRemove,
  readonly = false,
  userId
}: CartItemProps) => {
  if (!item.product) {
    console.error('Cart item has no associated product:', item);
    return null;
  }

  const variantPrice = item.variant?.price ?? item.product.price;
  const variantParameters = item.variant?.parameters ?? {};
  const formattedParameters = Object.entries(variantParameters)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <CartItemImage 
        imageUrl={item.product.image_url} 
        productName={item.product.name} 
      />
      
      <div className="flex-1 min-w-0">
        <CartItemHeader 
          productName={item.product.name}
          parameters={formattedParameters}
          onRemove={() => onRemove(item.id)}
          readonly={readonly}
        />
        
        {!readonly && (
          <div className="mt-2 flex items-center gap-4">
            <CartItemQuantity
              quantity={item.quantity}
              onQuantityChange={(delta) => 
                onQuantityChange(item.id, item.quantity, delta)
              }
            />
          </div>
        )}
      </div>

      <CartItemPrice
        variantPrice={variantPrice}
        quantity={item.quantity}
        discount={item.product.discount}
      />
    </div>
  );
};