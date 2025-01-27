import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ProductContainer } from "@/components/product/details/ProductContainer";

const Product = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState<string | null>(null);

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
          discount,
          brand
        `)
        .eq('id', id)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        throw productError;
      }

      console.log('Product fetched successfully with brand:', productData);
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
      <main>
        <ProductContainer product={product} userId={userId} />
      </main>
    </div>
  );
};

export default Product;