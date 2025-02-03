import { Product } from "@/types";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { BlogCarousel } from "@/components/blog/BlogCarousel";

interface MainContentProps {
  products: Product[];
  popularProducts: Product[];
}

export function MainContent({ products, popularProducts }: MainContentProps) {
  console.log('MainContent products:', products);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="space-y-16 py-16">
        <ProductCarousel 
          title="Latest Products" 
          products={products} 
        />
        <ProductCarousel 
          title="Popular Products" 
          products={popularProducts} 
        />
        <BlogCarousel />
      </div>
    </div>
  );
}