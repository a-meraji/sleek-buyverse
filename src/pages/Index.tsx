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
  const { 
    data: products, 
    isLoading: isProductsLoading, 
    error,
    refetch 
  } = useProducts();

  useEffect(() => {
    console.log("Index: Auth and Products loading state:", {
      isAuthLoading,
      isProductsLoading,
      timestamp: new Date().toISOString()
    });

    if (!isAuthLoading && isProductsLoading) {
      console.log("Index: Auth loading finished but products still loading, triggering refetch");
      refetch();
    }
  }, [isAuthLoading, isProductsLoading, refetch]);

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
  }, [isAuthLoading, isProductsLoading, error, products]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        {(isAuthLoading || isProductsLoading) ? (
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