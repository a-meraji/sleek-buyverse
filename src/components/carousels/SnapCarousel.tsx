import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SnapCarouselProps {
  products: Product[];
}

export function SnapCarousel({ products }: SnapCarouselProps) {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-sm mx-auto"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <div className="p-1">
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