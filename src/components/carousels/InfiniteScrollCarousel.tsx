import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface InfiniteScrollCarouselProps {
  products: Product[];
}

export function InfiniteScrollCarousel({ products }: InfiniteScrollCarouselProps) {
  // Double the products array for seamless infinite scrolling
  const extendedProducts = [...products, ...products];

  return (
    <div className="relative overflow-hidden">
      <div className="flex animate-scroll-horizontal">
        {extendedProducts.map((product, index) => (
          <div 
            key={`${product.id}-${index}`}
            className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4"
          >
            <ProductCard
              id={product.id}
              name={product.name}
              image={product.image_url}
              product_variants={product.product_variants}
              discount={product.discount}
              brand={product.brand}
            />
          </div>
        ))}
      </div>
    </div>
  );
}