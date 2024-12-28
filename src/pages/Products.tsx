import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { MobileFilters } from "@/components/products/MobileFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductsHeader } from "@/components/products/ProductsHeader";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const searchQuery = searchParams.get('search') || '';

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, priceRange, selectedCategory, sortOrder],
    queryFn: async () => {
      console.log('Fetching products with filters:', { searchQuery, priceRange, selectedCategory, sortOrder });
      
      let query = supabase
        .from('products')
        .select('*')
        .gte('price', priceRange[0])
        .lte('price', priceRange[1])
        .order('price', { ascending: sortOrder === 'asc' });

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched successfully:', data);
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map(item => item.category))];
      return uniqueCategories;
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
      <main className="container mx-auto px-4 py-8">
        <ProductsHeader setSortOrder={setSortOrder} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
          <div className="lg:col-span-3">
            <div className="mb-6 lg:hidden">
              <MobileFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
              />
            </div>
            <ProductGrid products={products} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;