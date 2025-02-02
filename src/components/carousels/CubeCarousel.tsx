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
    <div className="relative h-[600px] perspective-1000">
      <div className="relative w-full h-full transform-style-3d transition-transform duration-500"
           style={{ transform: `rotateY(${activeIndex * -90}deg)` }}>
        {products.slice(0, 4).map((product, index) => (
          <div
            key={product.id}
            className="absolute w-full h-full backface-hidden"
            style={{
              transform: `rotateY(${index * 90}deg) translateZ(300px)`,
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
        ))}
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