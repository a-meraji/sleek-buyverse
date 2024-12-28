import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddToCartButtonProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  productName: string;
}

export const AddToCartButton = ({ productId, userId, selectedSize, productName }: AddToCartButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: async () => {
      console.log('Adding to cart from product detail:', { productId });
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      if (!selectedSize) {
        throw new Error('Size not selected');
      }

      // First check if item already exists in cart
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', userId)
        .maybeSingle();

      console.log('Existing cart item check:', { existingItem, fetchError });

      if (fetchError) {
        console.error('Error checking cart:', fetchError);
        throw fetchError;
      }

      if (existingItem) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Error updating cart:', updateError);
          throw updateError;
        }
      } else {
        // Insert new item if it doesn't exist
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity: 1
          });

        if (insertError) {
          console.error('Error inserting to cart:', insertError);
          throw insertError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Added to cart",
        description: `${productName} (${selectedSize}) has been added to your cart.`,
      });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      if (error.message === 'User not authenticated') {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to add items to cart.",
          variant: "destructive",
        });
      } else if (error.message === 'Size not selected') {
        toast({
          title: "Please select a size",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={() => addToCart.mutate()}
      disabled={addToCart.isPending}
    >
      Add to Cart
    </Button>
  );
};