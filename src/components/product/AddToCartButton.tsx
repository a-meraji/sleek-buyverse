import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/cart/CartContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface AddToCartButtonProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  productName: string;
  disabled?: boolean;
  variantId?: string;
}

export const AddToCartButton = ({ 
  productId, 
  userId, 
  selectedSize, 
  productName,
  variantId,
  disabled 
}: AddToCartButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const handleAddToCart = async () => {
    try {
      if (!selectedSize) {
        toast({
          title: "Please select a size",
          description: "You need to select a size before adding to cart.",
          variant: "destructive",
        });
        return;
      }

      if (!variantId) {
        toast({
          title: "Error",
          description: "No variant selected for this size.",
          variant: "destructive",
        });
        return;
      }

      console.log('Adding to cart:', {
        productId,
        variantId,
        selectedSize,
        userId
      });

      if (!userId) {
        navigate('/auth');
        return;
      }

      await addToCart(userId, {
        product_id: productId,
        variant_id: variantId,
        quantity: 1,
      });

      // Invalidate the cart query to trigger a refetch
      await queryClient.invalidateQueries({ queryKey: ['cart', userId] });

      toast({
        title: "Added to cart",
        description: `${productName} (${selectedSize}) has been added to your cart.`,
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