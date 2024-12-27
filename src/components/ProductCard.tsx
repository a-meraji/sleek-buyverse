import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@supabase/auth-helpers-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export function ProductCard({ id, name, price, image }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const auth = useAuth();

  const addToCart = useMutation({
    mutationFn: async () => {
      console.log('Adding to cart:', { productId: id });
      
      if (!auth?.user?.id) {
        throw new Error('User not authenticated');
      }

      // First check if item already exists in cart
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', id)
        .eq('user_id', auth.user.id)
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
            user_id: auth.user.id,
            product_id: id,
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
        description: `${name} has been added to your cart.`,
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
    <div className="group relative rounded-lg border p-4 hover:shadow-lg transition-shadow">
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="mt-4">
        <Button 
          className="w-full" 
          onClick={() => addToCart.mutate()}
          disabled={addToCart.isPending}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}