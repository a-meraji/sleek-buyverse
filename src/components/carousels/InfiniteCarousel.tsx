import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface InfiniteCarouselProps {
  products: Product[];
}

export function InfiniteCarousel({ products }: InfiniteCarouselProps) {
  // Double the products array for seamless infinite scrolling
  const extendedProducts = [...products, ...products];

  return (
    <div className="relative overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4 animate-scroll-horizontal">
          {extendedProducts.map((product, index) => (
            <CarouselItem 
              key={`${product.id}-${index}`}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                image={product.image_url}
                product_variants={product.product_variants}
                discount={product.discount}
                brand={product.brand}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}