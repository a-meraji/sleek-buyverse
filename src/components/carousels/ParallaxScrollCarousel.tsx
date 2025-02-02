import { useEffect, useRef } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface ParallaxScrollCarouselProps {
  products: Product[];
}

export function ParallaxScrollCarousel({ products }: ParallaxScrollCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
        const horizontalScroll = Math.min(maxScroll, progress * maxScroll * 2);
        wrapper.scrollLeft = horizontalScroll;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-[100vh] relative overflow-hidden bg-gradient-to-r from-background to-background/50"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div 
          ref={wrapperRef}
          className="flex overflow-x-hidden w-full"
        >
          <div className="flex gap-6 px-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="flex-none w-[300px]"
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
        </div>
      </div>
    </div>
  );
}