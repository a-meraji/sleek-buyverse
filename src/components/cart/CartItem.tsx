import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { CartItem as CartItemType } from "@/contexts/cart/types";
import { Product } from "@/types/product";

interface CartItemProps {
  item: CartItemType & { product?: Product };
  userId: string | null;
  onQuantityChange: (id: string, currentQuantity: number, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, userId, onQuantityChange, onRemove }: CartItemProps) => {
  // Get the first variant's price or default to 0
  const variantPrice = item.product?.product_variants?.[0]?.price ?? 0;
  const subtotal = variantPrice * item.quantity;

  console.log('Rendering cart item:', {
    itemId: item.id,
    productName: item.product?.name,
    variantPrice,
    quantity: item.quantity,
    subtotal
  });

  return (
    <div className="flex gap-6 p-4 bg-secondary rounded-lg">
      <img
        src={item.product?.image_url}
        alt={item.product?.name}
        className="w-24 h-24 object-cover rounded"
      />
      
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
        
        <p className="text-sm text-muted-foreground">{item.product?.description}</p>
        <p>${variantPrice.toFixed(2)} × {item.quantity} = ${subtotal.toFixed(2)}</p>
        
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