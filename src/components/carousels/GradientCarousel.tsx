import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GradientCarouselProps {
  products: Product[];
}

export function GradientCarousel({ products }: GradientCarouselProps) {
  return (
    <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 rounded-xl">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="transform transition-all duration-300 hover:scale-105">
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
        <CarouselPrevious className="bg-white/90 hover:bg-white" />
        <CarouselNext className="bg-white/90 hover:bg-white" />
      </Carousel>
    </div>
  );
}