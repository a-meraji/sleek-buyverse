import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GridCarouselProps {
  products: Product[];
}

export function GridCarousel({ products }: GridCarouselProps) {
  // Create pairs of products for grid layout
  const productPairs = products.reduce<Product[][]>((acc, curr, i) => {
    if (i % 2 === 0) {
      acc.push([curr]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  }, []);

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {productPairs.map((pair, index) => (
            <CarouselItem 
              key={index} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="grid grid-cols-1 gap-4">
                {pair.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image_url}
                    product_variants={product.product_variants}
                    discount={product.discount}
                    brand={product.brand}
                  />
                ))}
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