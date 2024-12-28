import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Product = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Product detail auth state changed:', event, session);
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product with ID:', id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      console.log('Product fetched successfully:', data);
      return data;
    },
  });

  const addToCart = useMutation({
    mutationFn: async () => {
      console.log('Adding to cart from product detail:', { productId: id });
      
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
        .eq('product_id', id)
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
        description: `${product?.name} (${selectedSize}) has been added to your cart.`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-destructive">
            Product not found or error loading product details.
          </div>
        </main>
      </div>
    );
  }

  // Temporary sizes array since it's not in the database
  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-secondary rounded-lg overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl">${product.price.toFixed(2)}</p>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="space-y-4">
              <h3 className="font-medium">Select Size</h3>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={() => addToCart.mutate()}
              disabled={addToCart.isPending}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;