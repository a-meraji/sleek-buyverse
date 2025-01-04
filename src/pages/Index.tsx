import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/home/Footer";
import { LoadingState } from "@/components/home/LoadingState";
import { ErrorState } from "@/components/home/ErrorState";
import { MainContent } from "@/components/home/MainContent";
import { useProducts } from "@/hooks/products/useProducts";
import { useAuth } from "@/contexts/auth/AuthContext";
import HeroBanner from "@/components/home/HeroBanner";

const Index = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const { data: products, isLoading: isProductsLoading, error, refetch } = useProducts();

  useEffect(() => {
    console.log("Index: Component state:", {
      isAuthLoading,
      isProductsLoading,
      error: error ? {
        message: error.message,
        name: error.name
      } : null,
      productsCount: products?.length,
      hasProducts: Boolean(products?.length),
      productsValid: products?.every(p => p.id && p.name && p.image_url),
      timestamp: new Date().toISOString()
    });

    // Refetch products when auth loading is finished and products are still loading
    if (!isAuthLoading && isProductsLoading) {
      console.log("Index: Auth loading finished, refetching products...");
      refetch();
    }
  }, [isAuthLoading, isProductsLoading, products, error, refetch]);

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