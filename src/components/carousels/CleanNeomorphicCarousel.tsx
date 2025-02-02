import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CleanNeomorphicCarouselProps {
  products: Product[];
}

export function CleanNeomorphicCarousel({ products }: CleanNeomorphicCarouselProps) {
  return (
    <div className="relative bg-gray-50 p-8 rounded-2xl">
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
              <div className="p-6 bg-gray-50 rounded-xl shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] hover:shadow-[inset_6px_6px_12px_#d1d1d1,inset_-6px_-6px_12px_#ffffff] transition-all duration-300">
                <div className="transform transition-transform duration-300 hover:scale-[0.98]">
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
        <CarouselPrevious className="bg-gray-50 shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] border-none transition-all duration-300" />
        <CarouselNext className="bg-gray-50 shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] border-none transition-all duration-300" />
      </Carousel>
    </div>
  );
}