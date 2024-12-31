import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { MobileFilters } from "@/components/products/MobileFilters";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { useState } from "react";

const Products = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', priceRange, selectedCategory, searchQuery],
    queryFn: async () => {
      console.log('Fetching products from Supabase with filters:', { priceRange, selectedCategory, searchQuery });
      try {
        let query = supabase
          .from('products')
          .select('*')
          .gte('price', priceRange[0])
          .lte('price', priceRange[1]);

        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data: productsData, error: productsError } = await query;

        if (productsError) throw productsError;

        if (!productsData?.length) {
          console.log('No products found matching the criteria');
          return [];
        }

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
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
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
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">
                Error loading products
              </h2>
              <p className="text-muted-foreground">
                Please try refreshing the page
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-8">
          <ProductsHeader 
            setSortOrder={setSortOrder} 
            setMobileFiltersOpen={setMobileFiltersOpen}
          />
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <div className="hidden lg:block w-64">
              <FilterSidebar
                priceRange={priceRange}
                setPriceRange={(range: [number, number]) => setPriceRange(range)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={Array.from(new Set(products?.map(p => p.category)))}
              />
            </div>
            <div className="lg:hidden">
              <MobileFilters
                open={mobileFiltersOpen}
                setOpen={setMobileFiltersOpen}
                priceRange={priceRange}
                setPriceRange={(range: [number, number]) => setPriceRange(range)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={Array.from(new Set(products?.map(p => p.category)))}
              />
            </div>
            <div className="flex-1">
              <ProductGrid products={products} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;