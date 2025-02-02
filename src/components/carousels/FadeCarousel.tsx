import { useState, useEffect } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FadeCarouselProps {
  products: Product[];
}

export function FadeCarousel({ products }: FadeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  return (
    <div className="relative">
      <div className="overflow-hidden relative h-[500px]">
        <div className="flex justify-center items-center h-full">
          <div
            key={currentIndex}
            className="absolute w-full transition-opacity duration-500"
            onTransitionEnd={() => setIsAnimating(false)}
          >
            <div className="flex justify-center">
              <div className="w-72">
                <ProductCard
                  id={products[currentIndex].id}
                  name={products[currentIndex].name}
                  image={products[currentIndex].image_url}
                  product_variants={products[currentIndex].product_variants}
                  discount={products[currentIndex].discount}
                  brand={products[currentIndex].brand}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex justify-center mt-4 gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-primary/20"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}