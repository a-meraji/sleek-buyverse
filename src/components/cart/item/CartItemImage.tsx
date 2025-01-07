import { Badge } from "@/components/ui/badge";

interface CartItemImageProps {
  imageUrl: string;
  productName: string;
  discount?: number | null;
}

export const CartItemImage = ({ imageUrl, productName, discount }: CartItemImageProps) => {
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={productName}
        className="w-24 h-24 object-cover rounded"
      />
      {hasValidDiscount && (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
          {discount}% OFF
        </Badge>
      )}
    </div>
  );
};