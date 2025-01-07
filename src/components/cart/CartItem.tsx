import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { CartItem as CartItemType } from "@/contexts/cart/types";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
  item: CartItemType & { product?: Product };
  userId: string | null;
  onQuantityChange: (id: string, currentQuantity: number, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, userId, onQuantityChange, onRemove }: CartItemProps) => {
  // Find the selected variant
  const selectedVariant = item.product?.product_variants?.find(v => v.id === item.variant_id);
  const discount = item.product?.discount;
  
  const variantPrice = selectedVariant?.price ?? 0;
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
  const subtotal = discountedPrice * item.quantity;

  console.log('Rendering cart item:', {
    itemId: item.id,
    productName: item.product?.name,
    variantId: item.variant_id,
    variantPrice,
    discountedPrice,
    discount,
    quantity: item.quantity,
    subtotal,
    selectedVariant
  });

  return (
    <div className="flex gap-6 p-4 bg-secondary rounded-lg">
      <div className="relative">
        <img
          src={item.product?.image_url}
          alt={item.product?.name}
          className="w-24 h-24 object-cover rounded"
        />
        {hasValidDiscount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {discount}% OFF
          </Badge>
        )}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.product?.name}</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {selectedVariant && (
          <span className="block text-sm text-muted-foreground">
            Size: {selectedVariant.size}, Color: {selectedVariant.color}
          </span>
        )}

        <div className="space-y-1">
          {hasValidDiscount ? (
            <>
              <p className="text-red-500">${discountedPrice.toFixed(2)} × {item.quantity} = ${subtotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground line-through">
                ${variantPrice.toFixed(2)} × {item.quantity} = ${(variantPrice * item.quantity).toFixed(2)}
              </p>
            </>
          ) : (
            <p>${variantPrice.toFixed(2)} × {item.quantity} = ${subtotal.toFixed(2)}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onQuantityChange(item.id, item.quantity, -1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span>{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onQuantityChange(item.id, item.quantity, 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};