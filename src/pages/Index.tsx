import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/home/Footer";
import { LoadingState } from "@/components/home/LoadingState";
import { ErrorState } from "@/components/home/ErrorState";
import { MainContent } from "@/components/home/MainContent";
import { useHomeProducts } from "@/hooks/useHomeProducts";
import HeroBanner from "@/components/home/HeroBanner";
import { useEffect } from "react";

const Index = () => {
  const { data: products = [], isLoading, error } = useHomeProducts();

  useEffect(() => {
    console.log('Index: Component state:', {
      isLoading,
      error: error ? {
        message: error.message,
        name: error.name
      } : null,
      productsCount: products?.length,
      hasProducts: Boolean(products?.length),
      productsValid: products?.every(p => p.id && p.name && p.image_url),
      timestamp: new Date().toISOString()
    });
  }, [isLoading, error, products]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : products && products.length > 0 ? (
          <MainContent products={products} />
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