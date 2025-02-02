import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface WaterfallCarouselProps {
  products: Product[];
}

export function WaterfallCarousel({ products }: WaterfallCarouselProps) {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {products.map((product, index) => (
            <CarouselItem 
              key={product.id} 
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div 
                className="p-4 transform transition-all duration-500 hover:scale-105"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animation: 'float 3s ease-in-out infinite'
                }}
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}