import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ColorfulCarouselProps {
  products: Product[];
}

export function ColorfulCarousel({ products }: ColorfulCarouselProps) {
  const colors = [
    'from-pink-500/20 to-purple-500/20',
    'from-blue-500/20 to-cyan-500/20',
    'from-green-500/20 to-emerald-500/20',
    'from-yellow-500/20 to-orange-500/20'
  ];

  return (
    <div className="relative p-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product, index) => (
            <CarouselItem 
              key={product.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className={`p-4 bg-gradient-to-br ${colors[index % colors.length]} rounded-xl hover:scale-105 transition-transform`}>
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