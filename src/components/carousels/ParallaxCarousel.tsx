import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ParallaxCarouselProps {
  products: Product[];
}

export function ParallaxCarousel({ products }: ParallaxCarouselProps) {
  return (
    <div className="relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform -skew-y-6" />
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
                className="p-6 transform transition-transform duration-300 hover:translate-y-[-20px]"
                style={{ transitionDelay: `${index * 100}ms` }}
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
        <CarouselPrevious className="bg-white/80" />
        <CarouselNext className="bg-white/80" />
      </Carousel>
    </div>
  );
}