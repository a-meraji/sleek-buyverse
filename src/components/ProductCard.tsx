import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const ProductCard = ({ id, name, price, image }: ProductCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: async () => {
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select()
        .eq('product_id', id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({ product_id: id, quantity: 1 });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="group rounded-lg border bg-card text-card-foreground shadow-sm">
      <Link to={`/product/${id}`} className="block">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </Link>
      
      <div className="p-4 space-y-3">
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-semibold group-hover:underline">{name}</h3>
          <p className="text-lg">${price.toFixed(2)}</p>
        </Link>
        
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
};