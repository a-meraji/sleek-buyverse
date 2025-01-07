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
      console.log('Adding to cart:', { userId, productId, variantId, relatedProductId });

      if (!userId) {
        // Handle unauthenticated users - store in localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Get product details for local storage
        const { data: product } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .eq('id', productId)
          .single();

        if (!product) {
          throw new Error('Product not found');
        }

        const newItem = {
          id: `local-${Date.now()}`,
          product,
          variant_id: variantId,
          quantity: 1,
          related_product_id: relatedProductId
        };

        localCart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(localCart));
        console.log('Added item to local cart:', newItem);
        return newItem;
      }

      // Handle authenticated users - store in Supabase
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
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });
}