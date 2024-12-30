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

const Index = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8);
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched successfully:', data);
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-destructive">
            Error loading products. Please try again later.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroBanner />
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
      </main>
      <Footer />
    </div>
  );
};

export default Index;