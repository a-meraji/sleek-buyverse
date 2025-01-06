import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddToCartParams {
  userId: string | null;
  productId: string;
  variantId?: string;
  onSuccess: () => void;
  relatedProductId?: string;
}

export function useAddToCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, productId, variantId, relatedProductId }: AddToCartParams) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('Adding to cart:', { userId, productId, variantId, relatedProductId });

      // First check if item with same variant already exists in cart
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', productId)
        .eq('variant_id', variantId)
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking cart:', fetchError);
        throw fetchError;
      }

      if (existingItem) {
        // Update quantity if item with same variant exists
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + 1,
            related_product_id: relatedProductId
          })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Error updating cart:', updateError);
          throw updateError;
        }

        toast({
          title: "Cart Updated",
          description: "Item quantity has been increased in your cart",
        });
      } else {
        // Insert new item if it doesn't exist or has different variant
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            variant_id: variantId,
            quantity: 1,
            related_product_id: relatedProductId
          });

        if (insertError) {
          console.error('Error inserting to cart:', insertError);
          throw insertError;
        }

        toast({
          title: "Added to Cart",
          description: "Item has been added to your cart",
        });
      }
    },
    onSuccess: (_, { onSuccess }) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      onSuccess();
    },
    onError: (error: Error) => {
      console.error('Error adding to cart:', error);
      if (error.message === 'User not authenticated') {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to add items to cart.",
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
}