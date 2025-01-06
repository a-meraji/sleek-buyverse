import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import HeroBanner from "@/components/home/HeroBanner";
import { LoadingState } from "@/components/home/LoadingState";
import { ErrorState } from "@/components/home/ErrorState";
import { MainContent } from "@/components/home/MainContent";
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

        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .in('product_id', productsData.map(p => p.id));

        if (variantsError) throw variantsError;

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
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { data: popularProducts } = usePopularProducts('');

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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <MainContent 
          products={products || []} 
          popularProducts={popularProductsDetails || []}
        />
      </main>
    </div>
  );
};

export default Index;