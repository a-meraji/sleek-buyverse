import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CubeCarouselProps {
  products: Product[];
}

export function CubeCarousel({ products }: CubeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden mb-24">
      <div className="absolute inset-0 flex items-center justify-center perspective-[1000px]">
        <div 
          className="relative w-[400px] h-[500px]"
          style={{ 
            transform: `translateZ(-300px) rotateY(${activeIndex * -90}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {products.slice(0, 4).map((product, index) => {
            const isActive = ((activeIndex % 4) + 4) % 4 === index;
            return (
              <div
                key={product.id}
                className="absolute w-full h-full"
                style={{
                  transform: `rotateY(${index * 90}deg) translateZ(300px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'visible',
                  WebkitBackfaceVisibility: 'visible',
                  transition: 'opacity 0.8s ease',
                  opacity: isActive ? 1 : 0.6,
                  backgroundColor: isActive ? 'white' : 'transparent'
                }}
              >
                <div className="w-full h-full [transform-style:preserve-3d]">
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
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}