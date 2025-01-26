import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { Button } from "@/components/ui/button";

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface CartItemProps {
  item: CartItem;
  userId?: string;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  readonly?: boolean;
}

export function CartItem({ item, userId, onQuantityChange, onRemove, readonly = false }: CartItemProps) {
  const variantPrice = item.variant?.price ?? 0;
  const basePrice = item.variant?.price ?? (item.product?.product_variants?.[0]?.price ?? 0);
  
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <img src={item.product?.image_url} alt={item.product?.name} className="w-16 h-16 object-cover" />
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{item.product?.name}</h3>
          {item.variant && <p className="text-sm text-gray-500">{item.variant.parameters}</p>}
          <p className="text-sm font-medium">${basePrice.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          disabled={readonly || item.quantity <= 1}
        >
          -
        </Button>
        <span className="mx-2">{item.quantity}</span>
        <Button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          disabled={readonly}
        >
          +
        </Button>
        <Button onClick={() => onRemove(item.id)} className="ml-4" variant="destructive">
          Remove
        </Button>
      </div>
    </div>
  );
}
