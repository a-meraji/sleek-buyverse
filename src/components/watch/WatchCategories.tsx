import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const WatchCategories = () => {
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({
    queryKey: ['main-categories-with-images'],
    queryFn: async () => {
      console.log('Fetching main categories with first product image');
      const { data: products, error } = await supabase
        .from('products')
        .select('main_category, image_url')
        .not('main_category', 'is', null)
        .order('main_category');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      // Create a map to store first image for each category
      const categoryImages = new Map();
      products?.forEach(product => {
        if (product.main_category && !categoryImages.has(product.main_category)) {
          categoryImages.set(product.main_category, product.image_url);
        }
      });

      // Get unique categories with their images
      const uniqueCategories = Array.from(new Set(products?.map(item => item.main_category)))
        .filter(Boolean)
        .map(category => ({
          name: category,
          image: categoryImages.get(category)
        }));

      console.log('Processed categories:', uniqueCategories);
      return uniqueCategories;
    }
  });

  const handleCategoryClick = (category: string) => {
    console.log('Navigating to category with main_category:', category);
    navigate(`/products?main_category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-4 py-4 px-2">
      {categories.map(({ name, image }) => (
        <div
          key={name}
          className="flex flex-col items-center min-w-[100px] cursor-pointer"
          onClick={() => handleCategoryClick(name)}
        >
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 mb-2">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-center">{name}</span>
        </div>
      ))}
    </div>
  );
};