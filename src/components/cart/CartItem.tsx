import { CartItem as CartItemType } from "@/contexts/cart/types";
import { Product } from "@/types";
import { CartItemHeader } from "./item/CartItemHeader";
import { CartItemImage } from "./item/CartItemImage";
import { CartItemPrice } from "./item/CartItemPrice";
import { CartItemQuantity } from "./item/CartItemQuantity";

interface CartItemProps {
  item: CartItemType & { product?: Product };
  userId: string | null;
  onQuantityChange: (id: string, currentQuantity: number, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onQuantityChange, onRemove }: CartItemProps) => {
  const selectedVariant = item.product?.product_variants?.find(v => v.id === item.variant_id);
  
  console.log('Rendering cart item:', {
    itemId: item.id,
    productName: item.product?.name,
    variantId: item.variant_id,
    selectedVariant
  });

  return (
    <div className="flex gap-6 p-4 bg-secondary rounded-lg">
      <CartItemImage 
        imageUrl={item.product?.image_url || ''}
        productName={item.product?.name || ''}
        discount={item.product?.discount}
      />
      
      <div className="flex-1 space-y-2">
        <CartItemHeader 
          productName={item.product?.name || ''}
          onRemove={() => onRemove(item.id)}
        />
        
        {selectedVariant && (
          <span className="block text-sm text-muted-foreground">
            Size: {selectedVariant.size}, Color: {selectedVariant.color}
          </span>
        )}

        <CartItemPrice 
          variantPrice={selectedVariant?.price ?? 0}
          quantity={item.quantity}
          discount={item.product?.discount}
        />
        
        <CartItemQuantity 
          quantity={item.quantity}
          onQuantityChange={(delta) => onQuantityChange(item.id, item.quantity, delta)}
        />
      </div>
    </div>
  );
};