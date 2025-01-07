import { Button } from "@/components/ui/button";
import { useAddToCart } from "./dialog/useAddToCart";
import { ProductVariant } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  selectedColor: string;
  productName: string;
  disabled?: boolean;
  variants?: ProductVariant[];
  relatedProductId?: string;
  onSuccess?: () => void;
}

export function AddToCartButton({
  productId,
  userId,
  selectedSize,
  selectedColor,
  productName,
  disabled,
  variants,
  relatedProductId,
  onSuccess
}: AddToCartButtonProps) {
  const addToCart = useAddToCart();
  const { toast } = useToast();

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
        toast({
          title: "Added to Cart",
          description: `${productName} has been added to your cart`,
        });
        onSuccess?.();
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