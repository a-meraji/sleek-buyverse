import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface DarkCarouselProps {
  products: Product[];
}

export function DarkCarousel({ products }: DarkCarouselProps) {
  return (
    <div className="relative bg-gray-900 p-8 rounded-xl">
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
              <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
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
        <CarouselPrevious className="bg-gray-800 hover:bg-gray-700 text-white" />
        <CarouselNext className="bg-gray-800 hover:bg-gray-700 text-white" />
      </Carousel>
    </div>
  );
}