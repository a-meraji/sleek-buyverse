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
}

export const AddToCartButton = ({ 
  productId, 
  userId, 
  selectedSize, 
  productName, 
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

      console.log('Adding to cart:', {
        productId,
        selectedSize,
        userId
      });

      await addToCart(userId, {
        product_id: productId,
        quantity: 1,
      });

      // Invalidate the cart query to trigger a refetch
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      }

      toast({
        title: "Added to cart",
        description: `${productName} (${selectedSize}) has been added to your cart.`,
      });
    } catch (error) {
      if (!userId) {
        navigate('/auth');
        return;
      }
      
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