import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/cart/CartContext";
import { useQueryClient } from "@tanstack/react-query";
import { ProductVariant } from "@/types";

interface AddToCartButtonProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  selectedColor: string;
  productName: string;
  disabled?: boolean;
  variants?: ProductVariant[];
}

export const AddToCartButton = ({ 
  productId, 
  userId, 
  selectedSize,
  selectedColor,
  productName,
  variants,
  disabled 
}: AddToCartButtonProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const handleAddToCart = async () => {
    try {
      if (!selectedSize || !selectedColor) {
        toast({
          title: "Please select options",
          description: "You need to select both size and color before adding to cart.",
          variant: "destructive",
        });
        return;
      }

      // Find the variant that matches both the selected size and color
      const selectedVariant = variants?.find(v => 
        v.size === selectedSize && v.color === selectedColor
      );
      
      if (!selectedVariant) {
        toast({
          title: "Error",
          description: "Selected combination is not available.",
          variant: "destructive",
        });
        return;
      }

      console.log('Adding to cart:', {
        productId,
        variantId: selectedVariant.id,
        selectedSize,
        selectedColor,
        userId,
        price: selectedVariant.price
      });

      await addToCart(userId, {
        product_id: productId,
        variant_id: selectedVariant.id,
        quantity: 1,
      });

      // Invalidate the cart query to trigger a refetch
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      }

      toast({
        title: "Added to cart",
        description: `${productName} (${selectedSize}, ${selectedColor}) has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleAddToCart}
      disabled={disabled}
    >
      Add to Cart
    </Button>
  );
};