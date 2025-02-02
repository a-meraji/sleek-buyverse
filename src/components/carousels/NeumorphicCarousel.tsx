import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface NeumorphicCarouselProps {
  products: Product[];
}

export function NeumorphicCarousel({ products }: NeumorphicCarouselProps) {
  return (
    <div className="relative bg-gray-100 p-8 rounded-xl">
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
              <div className="p-4 bg-gray-100 rounded-xl shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] transition-shadow">
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
        <CarouselPrevious className="bg-gray-100 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff]" />
        <CarouselNext className="bg-gray-100 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff]" />
      </Carousel>
    </div>
  );
}