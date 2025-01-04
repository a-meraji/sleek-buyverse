import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useState } from "react";

const Product = () => {
  const { id } = useParams();
  const { session } = useAuthSession();
  const [selectedSize, setSelectedSize] = useState("");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Product page: Starting product fetch:', {
        productId: id,
        timestamp: new Date().toISOString()
      });

      try {
        const { data: product, error, status, statusText } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (*),
            product_images (*)
          `)
          .eq('id', id)
          .single();

        console.log('Product page: Query response:', {
          status,
          statusText,
          hasError: !!error,
          hasData: !!product,
          timestamp: new Date().toISOString()
        });

        if (error) {
          console.error('Product page: Error fetching product:', {
            error,
            code: error.code,
            details: error.details,
            hint: error.hint,
            timestamp: new Date().toISOString()
          });
          throw error;
        }

        if (!product) {
          console.log('Product page: No product found');
          throw new Error('Product not found');
        }

        console.log('Product page: Fetch successful:', {
          product,
          timestamp: new Date().toISOString()
        });

        return product;
      } catch (err) {
        console.error('Product page: Unexpected error:', {
          error: err,
          timestamp: new Date().toISOString()
        });
        throw err;
      }
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {error ? "Error loading product" : "Product not found"}
            </h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductImageCarousel
            mainImage={product.image_url}
            additionalImages={product.product_images}
          />
          <ProductDetails
            product={product}
            userId={session?.user?.id || null}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />
        </div>
      </main>
    </div>
  );
};

export default Product;