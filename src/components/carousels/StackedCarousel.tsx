import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StackedCarouselProps {
  products: Product[];
}

export function StackedCarousel({ products }: StackedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="relative h-[600px] flex items-center justify-center">
      {products.map((product, index) => {
        const offset = (index - activeIndex + products.length) % products.length;
        const zIndex = products.length - offset;
        const opacity = Math.max(1 - offset * 0.2, 0.3);
        const scale = Math.max(1 - offset * 0.1, 0.8);
        const translateY = offset * 20;

        return (
          <div
            key={product.id}
            className="absolute transition-all duration-300 w-80"
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              zIndex,
            }}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              image={product.image_url}
              product_variants={product.product_variants}
              discount={product.discount}
              brand={product.brand}
            />
          </div>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 z-50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 z-50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}