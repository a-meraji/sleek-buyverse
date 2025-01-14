import { CartItem } from "@/types";
import { Badge } from "@/components/ui/badge";

interface OrderItemProps {
  item: CartItem;
}

export const OrderItem = ({ item }: OrderItemProps) => {
  const { product, variant, quantity } = item;
  
  console.log('OrderItem rendering with:', {
    itemId: item.id,
    productName: product?.name,
    variant,
    variantId: item.variant_id,
    price: variant?.price,
    quantity
  });

  if (!product || !variant) {
    console.error('Missing product or variant data:', { item });
    return null;
  }

  const variantPrice = variant.price;
  const discount = product.discount;
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;
  const discountedPrice = hasValidDiscount ? variantPrice * (1 - discount / 100) : variantPrice;
  const subtotal = discountedPrice * quantity;

  return (
    <div className="flex gap-4 p-4 bg-background rounded-lg border">
      <div className="w-20 h-20 rounded-md overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="bg-primary/10">
                Size: {variant.size}
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                Color: {variant.color}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            {hasValidDiscount ? (
              <>
                <p className="text-sm text-muted-foreground line-through">
                  ${variantPrice.toFixed(2)} × {quantity}
                </p>
                <p className="text-red-500">
                  ${discountedPrice.toFixed(2)} × {quantity}
                </p>
                <p className="font-medium text-red-500">
                  ${subtotal.toFixed(2)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  ${variantPrice.toFixed(2)} × {quantity}
                </p>
                <p className="font-medium">
                  ${subtotal.toFixed(2)}
                </p>
              </>
            )}
          </div>
        </div>
        
        {variant.stock < 5 && (
          <p className="text-sm text-red-500 mt-2">
            Only {variant.stock} left in stock!
          </p>
        )}
      </div>
    </div>
  );
};