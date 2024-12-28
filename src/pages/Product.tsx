import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ProductDetails } from "@/components/product/ProductDetails";

const Product = () => {
  const { id } = useParams();
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
          <div className="bg-secondary rounded-lg overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>
          
          <ProductDetails
            product={product}
            userId={userId}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />
        </div>
      </main>
    </div>
  );
};

export default Product;