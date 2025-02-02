import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VerticalCarouselProps {
  products: Product[];
}

export function VerticalCarousel({ products }: VerticalCarouselProps) {
  return (
    <div className="relative h-[800px]">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          vertical: true,
        }}
        className="h-full"
      >
        <CarouselContent className="-mt-2 h-full">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pt-2 basis-1/2">
              <ProductCard
                id={product.id}
                name={product.name}
                image={product.image_url}
                product_variants={product.product_variants}
                discount={product.discount}
                brand={product.brand}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="rotate-90" />
        <CarouselNext className="rotate-90" />
      </Carousel>
    </div>
  );
}