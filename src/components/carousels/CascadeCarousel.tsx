import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CascadeCarouselProps {
  products: Product[];
}

export function CascadeCarousel({ products }: CascadeCarouselProps) {
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
                className="p-4 transform hover:-translate-y-2 transition-transform duration-300"
                style={{ marginTop: `${index % 3 * 20}px` }}
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