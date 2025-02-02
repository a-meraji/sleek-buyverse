import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TimelineCarouselProps {
  products: Product[];
}

export function TimelineCarousel({ products }: TimelineCarouselProps) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />
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
              <div className={`p-4 ${index % 2 === 0 ? 'translate-y-8' : '-translate-y-8'}`}>
                <div className="relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full" />
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    image={product.image_url}
                    product_variants={product.product_variants}
                    discount={product.discount}
                    brand={product.brand}
                  />
                </div>
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