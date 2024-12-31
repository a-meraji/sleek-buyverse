import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error;
}

export function ProductGrid({ products, isLoading, error }: ProductGridProps) {
  console.log('Rendering ProductGrid with products:', products);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          image={product.image_url}
          variants={product.product_variants}
        />
      ))}
    </div>
  );
}