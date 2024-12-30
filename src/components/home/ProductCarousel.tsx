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
  products: Product[] | null | undefined;
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  if (!products?.length) return null;

  return (
    <section className="py-16 px-6">
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
                          price={Number(product.price)}
                          image={product.image_url}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <CarouselPrevious className="relative -left-4 lg:-left-8 bg-white shadow-lg opacity-80 hover:opacity-100" />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <CarouselNext className="relative -right-4 lg:-right-8 bg-white shadow-lg opacity-80 hover:opacity-100" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}