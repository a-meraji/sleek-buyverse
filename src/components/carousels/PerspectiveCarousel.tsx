import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PerspectiveCarouselProps {
  products: Product[];
}

export function PerspectiveCarousel({ products }: PerspectiveCarouselProps) {
  return (
    <div className="relative perspective-1000">
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
                className="p-4 transform transition-all duration-300 hover:rotate-y-10 hover:scale-110"
                style={{ 
                  transform: `rotateY(${(index - 2) * 5}deg) translateZ(${Math.abs(index - 2) * -20}px)`,
                  opacity: Math.max(1 - Math.abs(index - 2) * 0.2, 0.5)
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
        <CarouselPrevious className="z-10" />
        <CarouselNext className="z-10" />
      </Carousel>
    </div>
  );
}