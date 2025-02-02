import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MasonryCarouselProps {
  products: Product[];
}

export function MasonryCarousel({ products }: MasonryCarouselProps) {
  const getRandomHeight = (index: number) => {
    const heights = ['h-auto', 'h-[120%]', 'h-[90%]'];
    return heights[index % 3];
  };

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
              className={`basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 ${getRandomHeight(index)}`}
            >
              <div className="p-4 h-full">
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