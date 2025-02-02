import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GlassCarouselProps {
  products: Product[];
}

export function GlassCarousel({ products }: GlassCarouselProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-500/5 to-purple-500/5 backdrop-blur-sm p-8 rounded-xl">
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
              <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl hover:bg-white/60 transition-colors">
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