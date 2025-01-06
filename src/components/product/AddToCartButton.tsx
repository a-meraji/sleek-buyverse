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
  relatedProductId?: string; // Add this prop
}

export function AddToCartButton({
  productId,
  userId,
  selectedSize,
  selectedColor,
  productName,
  disabled,
  variants,
  relatedProductId // Add this prop
}: AddToCartButtonProps) {
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    console.log('Adding to cart with related product:', relatedProductId);
    addToCart.mutate({
      userId,
      productId,
      relatedProductId, // Pass the related product ID
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