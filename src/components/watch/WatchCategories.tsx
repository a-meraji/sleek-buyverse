import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface CategoryData {
  category: string;
  image_url: string;
}

export function WatchCategories() {
  const navigate = useNavigate();

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

      // Get unique categories with their first product image
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

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category.toLowerCase()}`);
  };

  return (
    <div className="py-6 overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex gap-4">
          {categories.map((category) => (
            <button
              key={category.category}
              onClick={() => handleCategoryClick(category.category)}
              className="flex-shrink-0 group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary p-0.5 group-hover:ring-4 transition-all">
                <img
                  src={category.image_url}
                  alt={category.category}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <p className="mt-2 text-sm text-center">{category.category}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}