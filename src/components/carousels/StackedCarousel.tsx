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
        // Calculate the distance from active index
        const distance = (index - activeIndex + products.length) % products.length;
        
        // Only show active card and 3 cards behind it
        if (distance > 3) return null;

        // Calculate styling based on position
        const zIndex = products.length - distance;
        const translateX = distance * 15; // Add horizontal offset
        const translateY = distance * 15; // Increase vertical offset
        const rotate = distance === 0 ? 0 : (distance % 2 === 0 ? 5 : -5); // Increase rotation angle
        const scale = Math.max(1 - distance * 0.08, 0.85); // Adjust scale to be more visible

        return (
          <div
            key={product.id}
            className="absolute transition-all duration-300 w-80 bg-white shadow-lg rounded-lg"
            style={{
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
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