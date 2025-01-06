import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import HeroBanner from "@/components/home/HeroBanner";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { StyleShowcase } from "@/components/home/StyleShowcase";
import { ReviewsScroll } from "@/components/home/ReviewsScroll";
import { usePopularProducts } from "@/components/product/related/usePopularProducts";
import { Product } from "@/types";

const Index = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(8)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Fetch variants separately to ensure RLS policies are properly applied
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .in('product_id', productsData.map(p => p.id));

        if (variantsError) throw variantsError;

        // Combine products with their variants
        const productsWithVariants = productsData.map(product => ({
          ...product,
          product_variants: variantsData.filter(v => v.product_id === product.id)
        }));

        console.log('Products with variants fetched successfully:', productsWithVariants);
        return productsWithVariants;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  // Fetch popular products with proper error handling
  const { data: popularProducts, isLoading: isLoadingPopular } = usePopularProducts('');

  // Get the full product details for popular products
  const { data: popularProductsDetails } = useQuery({
    queryKey: ['popular-products-details', popularProducts],
    queryFn: async () => {
      if (!popularProducts?.length) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .in('id', popularProducts.map(p => p.product_id));

      if (error) throw error;
      return data;
    },
    enabled: !!popularProducts?.length,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex-1">
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">
                Error loading products
              </h2>
              <p className="text-muted-foreground mb-4">
                Please try refreshing the page
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        {products && products.length > 0 && (
          <>
            <ProductCarousel title="New Arrivals" products={products} />
            <StyleShowcase />
            {popularProductsDetails && popularProductsDetails.length > 0 && (
              <ProductCarousel 
                title="Popular Products" 
                products={popularProductsDetails} 
              />
            )}
            <ReviewsScroll />
            <div className="py-16 px-6 text-center">
              <Link to="/products">
                <Button className="bg-[#1d8757] hover:bg-[#1d8757]/90 text-white px-8 py-6 rounded-full text-lg">
                  <Grid className="mr-2 h-5 w-5" />
                  View All Products
                </Button>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;