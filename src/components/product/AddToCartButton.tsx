import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddToCartButtonProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  productName: string;
  disabled?: boolean;
}

export const AddToCartButton = ({ productId, userId, selectedSize, productName, disabled }: AddToCartButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: async () => {
      console.log('Adding to cart:', { productId, userId, selectedSize });
      
      if (!userId) {
        window.location.href = '/auth';
        throw new Error('User not authenticated');
      }

      if (!selectedSize) {
        toast({
          title: "Please select a size",
          description: "You need to select a size before adding to cart.",
          variant: "destructive",
        });
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
    onError: (error: Error) => {
      console.error('Error adding to cart:', error);
      if (error.message === 'User not authenticated') {
        // Don't show toast since we're redirecting
        return;
      } else if (error.message === 'Size not selected') {
        // Toast is already shown in mutationFn
        return;
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
      disabled={disabled || addToCart.isPending}
    >
      {addToCart.isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
};