import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CartItemProps {
  item: {
    id: string;
    product_id: string;
    variant_id?: string;
    quantity: number;
    product?: Product;
  };
  userId: string | null;
  onQuantityChange: (id: string, quantity: number, delta: number) => void;
  onRemove: (id: string) => void;
  readonly?: boolean;
}

export function CartItem({ 
  item, 
  userId,
  onQuantityChange,
  onRemove,
  readonly = false
}: CartItemProps) {
  const { toast } = useToast();
  const selectedVariant = item.variant; // Assuming variant is fetched with the item
  const variantPrice = selectedVariant?.price || 0;

  const handleRemove = () => {
    onRemove(item.id);
    toast({
      title: "Item removed",
      description: `${item.product?.name} has been removed from your cart.`,
    });
  };

  return (
    <div className="flex gap-4 py-4">
      <CartItemImage 
        imageUrl={item.product?.image_url} 
        productName={item.product?.name}
      />
      
      <div className="flex-1 space-y-1">
        <CartItemHeader
          productName={item.product?.name}
          onRemove={handleRemove}
          readonly={readonly}
        />
        
        <span className="block text-sm text-muted-foreground">
          {selectedVariant && Object.entries(selectedVariant.parameters)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")}
        </span>

        <CartItemPrice 
          price={variantPrice} 
          quantity={item.quantity}
          discount={item.product?.discount}
        />
        
        {!readonly && (
          <CartItemQuantity
            quantity={item.quantity}
            onQuantityChange={(delta) => {
              if (onQuantityChange) {
                onQuantityChange(item.id, item.quantity, delta);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
