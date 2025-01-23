import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";

interface CategoryData {
  category: string;
  image_url: string;
}

export function WatchCategories() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: categories = [] } = useQuery({
    queryKey: ['watch-categories'],
    queryFn: async () => {
      console.log('Fetching categories for watch page');
      const { data, error } = await supabase
        .from('products')
        .select('category, image_url')
        .not('category', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      const uniqueCategories = Array.from(
        new Map(
          data
            .filter(product => product.category && product.image_url)
            .map(product => [product.category, {
              category: product.category,
              image_url: product.image_url
            }])
        ).values()
      );

      console.log('Unique categories with images:', uniqueCategories);
      return uniqueCategories as CategoryData[];
    }
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (!scrollContainerRef.current) return;
    
    const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCategoryClick = (category: string) => {
    if (!isDragging) {
      console.log('Navigating to products with category:', category);
      const searchParams = new URLSearchParams();
      searchParams.set('category', category.toLowerCase());
      navigate(`/products?${searchParams.toString()}`);
    }
  };

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing overscroll-x-contain"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex gap-4 w-max pb-4">
            {categories.map((category) => (
              <button
                key={category.category}
                onClick={() => handleCategoryClick(category.category)}
                className="flex-shrink-0 group select-none"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary p-0.5 group-hover:ring-4 transition-all">
                  <img
                    src={category.image_url}
                    alt={category.category}
                    className="w-full h-full object-cover rounded-full"
                    draggable="false"
                  />
                </div>
                <p className="mt-2 text-sm text-center">{category.category}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}