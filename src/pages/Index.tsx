import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import HeroBanner from "@/components/home/HeroBanner";
import { LoadingState } from "@/components/home/LoadingState";
import { ErrorState } from "@/components/home/ErrorState";
import { MainContent } from "@/components/home/MainContent";

const Index = () => {
  // Fetch latest products
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching latest products...');
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_variants(*),
          brand
        `)
        .limit(8)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      console.log('Latest products fetched:', productsData);
      return productsData;
    },
  });

  // Fetch popular products
  const { data: popularProducts, isLoading: popularLoading } = useQuery({
    queryKey: ['popular-products-home'],
    queryFn: async () => {
      console.log('Fetching popular products...');
      
      // First get popular product IDs
      const { data: popularIds, error: popularError } = await supabase
        .rpc('get_popular_products')
        .limit(8);

      if (popularError) throw popularError;
      
      if (!popularIds?.length) {
        console.log('No popular products found');
        return [];
      }

      // Then fetch the full product details
      const { data: popularProductsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_variants(*),
          brand
        `)
        .in('id', popularIds.map(p => p.product_id));

      if (productsError) throw productsError;
      
      console.log('Popular products fetched:', popularProductsData);
      return popularProductsData;
    },
  });

  const isLoading = productsLoading || popularLoading;
  
  if (isLoading) return <LoadingState />;
  if (productsError) return <ErrorState />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <MainContent 
          products={products || []} 
          popularProducts={popularProducts || []}
        />
      </main>
    </div>
  );
};

export default Index;