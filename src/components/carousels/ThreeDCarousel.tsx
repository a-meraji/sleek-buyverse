import { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ThreeDCarouselProps {
  products: Product[];
}

export function ThreeDCarousel({ products }: ThreeDCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="relative h-[600px] perspective">
      <div className="relative h-full flex items-center justify-center">
        {products.map((product, index) => {
          const offset = (index - currentIndex + products.length) % products.length;
          const isActive = offset === 0;
          const isPrev = offset === products.length - 1;
          const isNext = offset === 1;

          return (
            <div
              key={product.id}
              className={`absolute transition-all duration-500 w-72
                ${isActive ? "z-20 scale-100 opacity-100" : ""}
                ${isPrev ? "z-10 -translate-x-full scale-75 opacity-50" : ""}
                ${isNext ? "z-10 translate-x-full scale-75 opacity-50" : ""}
                ${!isActive && !isPrev && !isNext ? "opacity-0" : ""}
              `}
              style={{
                transform: `
                  ${isActive ? "rotateY(0deg)" : ""}
                  ${isPrev ? "rotateY(45deg)" : ""}
                  ${isNext ? "rotateY(-45deg)" : ""}
                `
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
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}