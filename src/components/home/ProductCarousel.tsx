import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  console.log('Rendering ProductCarousel with products:', products);

  if (!products?.length) return null;

  return (
    <section className="py-16 px-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="relative group">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem 
                  key={product.id} 
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="p-1">
                    <Card className="border-none shadow-none">
                      <CardContent className="p-0">
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          image={product.image_url}
                          product_variants={product.product_variants}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <CarouselPrevious className="relative bg-white shadow-lg opacity-80 hover:opacity-100" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              <CarouselNext className="relative bg-white shadow-lg opacity-80 hover:opacity-100" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}