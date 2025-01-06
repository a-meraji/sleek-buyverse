import { Button } from "@/components/ui/button";
import { useAddToCart } from "./dialog/useAddToCart";
import { ProductVariant } from "@/types";

interface AddToCartButtonProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  selectedColor: string;
  productName: string;
  disabled?: boolean;
  variants?: ProductVariant[];
  relatedProductId?: string;
}

export function AddToCartButton({
  productId,
  userId,
  selectedSize,
  selectedColor,
  productName,
  disabled,
  variants,
  relatedProductId
}: AddToCartButtonProps) {
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    // Find the selected variant
    const selectedVariant = variants?.find(
      v => v.size === selectedSize && v.color === selectedColor
    );

    console.log('Adding to cart:', {
      productId,
      variantId: selectedVariant?.id,
      selectedSize,
      selectedColor,
      relatedProductId
    });

    addToCart.mutate({
      userId,
      productId,
      variantId: selectedVariant?.id,
      relatedProductId,
      onSuccess: () => {
        console.log('Successfully added to cart');
      }
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || addToCart.isPending}
      className="w-full"
    >
      Add to Cart
    </Button>
  );
}