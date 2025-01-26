import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { ViewAllProductsButton } from "./ViewAllProductsButton";

interface MainContentProps {
  products: Product[];
  popularProducts: Product[];
}

export function MainContent({ products, popularProducts }: MainContentProps) {
  console.log('MainContent products:', products);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="space-y-16 py-16">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Latest Products</h2>
            <ViewAllProductsButton />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image_url}
                product_variants={product.product_variants}
                discount={product.discount}
                brand={product.brand}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Popular Products</h2>
            <ViewAllProductsButton />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image_url}
                product_variants={product.product_variants}
                discount={product.discount}
                brand={product.brand}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}