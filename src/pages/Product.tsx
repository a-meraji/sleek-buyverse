import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Heart } from "lucide-react";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Product = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Product detail auth state changed:', event, session);
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId && id) {
      const checkFavorite = async () => {
        const { data } = await supabase
          .from('favorites')
          .select()
          .eq('user_id', userId)
          .eq('product_id', id)
          .single();
        
        setIsFavorite(!!data);
      };
      
      checkFavorite();
    }
  }, [userId, id]);

  const handleFavoriteToggle = async () => {
    if (!userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to favorites",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', id);

        if (error) throw error;
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Product has been removed from your favorites"
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .upsert({ 
            user_id: userId,
            product_id: id
          });

        if (error) throw error;
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Product has been added to your favorites"
        });
      }
    } catch (error) {
      console.error('Error managing favorites:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  };

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product with ID:', id);
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_variants (*),
          product_images (*),
          discount
        `)
        .eq('id', id)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        throw productError;
      }

      console.log('Product fetched successfully with discount:', productData);
      return productData;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ProductImageCarousel 
            mainImage={product.image_url}
            additionalImages={product.product_images}
          />
          
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <ProductDetails
                product={product}
                userId={userId}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                className="mt-1"
              >
                <Heart 
                  className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;