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
import { Footer } from "@/components/home/Footer";
import { Product } from "@/types";

const Index = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      try {
        // First fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, product_variants(*), product_images(*)');

        if (productsError) {
          console.error('Error fetching products:', productsError);
          throw productsError;
        }

        if (!productsData) {
          console.log('No products found');
          return [];
        }

        console.log('Products fetched successfully:', productsData);
        return productsData;
      } catch (error) {
        console.error('Error in products query:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
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
        <Footer />
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        {products && products.length > 0 ? (
          <>
            <ProductCarousel title="New Arrivals" products={products} />
            <StyleShowcase />
            <ProductCarousel title="Popular Products" products={products} />
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
        ) : (
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground">No products available</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;