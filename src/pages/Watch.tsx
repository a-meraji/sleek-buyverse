import { MainContent } from "@/components/home/MainContent";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/home/Footer";
import { WatchCategories } from "@/components/watch/WatchCategories";
import { WatchBanners } from "@/components/watch/WatchBanners";
import { WatchBrands } from "@/components/watch/WatchBrands";
import { WatchPolicies } from "@/components/watch/WatchPolicies";
import { ReviewsScroll } from "@/components/home/ReviewsScroll";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export default function Watch() {
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products for watch page');
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return data as Product[];
    }
  });

  const { data: popularProducts = [] } = useQuery({
    queryKey: ['popular-products'],
    queryFn: async () => {
      console.log('Fetching popular products');
      const { data: popularIds, error: popularError } = await supabase
        .rpc('get_popular_products');

      if (popularError) {
        console.error('Error fetching popular products:', popularError);
        throw popularError;
      }

      if (!popularIds?.length) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .in('id', popularIds.map(p => p.product_id));

      if (error) {
        console.error('Error fetching popular product details:', error);
        throw error;
      }

      return data as Product[];
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <WatchCategories />
        <WatchBanners />
        <WatchBrands />
        <MainContent products={products} popularProducts={popularProducts} />
        <WatchPolicies />
        <ReviewsScroll />
      </main>
      <Footer />
    </div>
  );
}