import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CircularCarouselProps {
  products: Product[];
}

export function CircularCarousel({ products }: CircularCarouselProps) {
  return (
    <div className="relative p-8">
      <div className="animate-rotate-slow">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem 
                key={product.id} 
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    image={product.image_url}
                    product_variants={product.product_variants}
                    discount={product.discount}
                    brand={product.brand}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-white/80" />
          <CarouselNext className="bg-white/80" />
        </Carousel>
      </div>
    </div>
  );
}