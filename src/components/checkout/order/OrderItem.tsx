import { CartItem } from "@/types";
import { Badge } from "@/components/ui/badge";

interface OrderItemProps {
  item: CartItem;
}

export const OrderItem = ({ item }: OrderItemProps) => {
  const variant = item.product?.product_variants?.find(v => v.id === item.variant_id);
  const variantPrice = variant?.price ?? 0;
  const discount = item.product?.discount;
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
  const subtotal = discountedPrice * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-background rounded-lg border">
      <div className="w-20 h-20 rounded-md overflow-hidden">
        <img 
          src={item.product?.image_url} 
          alt={item.product?.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{item.product?.name}</h3>
            {variant && (
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary">{variant.size}</Badge>
                <Badge variant="secondary">{variant.color}</Badge>
              </div>
            )}
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
                <p className="text-sm text-muted-foreground">
                  ${variantPrice.toFixed(2)} × {item.quantity}
                </p>
                <p className="font-medium">
                  ${subtotal.toFixed(2)}
                </p>
              </>
            )}
          </div>
        </div>
        
        {variant && variant.stock < 5 && (
          <p className="text-sm text-red-500 mt-2">
            Only {variant.stock} left in stock!
          </p>
        )}
      </div>
    </div>
  );
};