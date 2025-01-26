import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const WatchCategories = () => {
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({
    queryKey: ['main-categories'],
    queryFn: async () => {
      console.log('Fetching main categories');
      const { data, error } = await supabase
        .from('products')
        .select('main_category')
        .not('main_category', 'is', null)
        .order('main_category');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      // Get unique categories
      const uniqueCategories = Array.from(new Set(data.map(item => item.main_category)));
      return uniqueCategories.map(category => ({
        name: category,
        image: getCategoryImage(category)
      }));
    }
  });

  const handleCategoryClick = (category: string) => {
    console.log('Navigating to category:', category);
    navigate(`/products?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  // Function to get category image based on category name
  const getCategoryImage = (category: string): string => {
    const images: Record<string, string> = {
      'Hat': 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9',
      'Cap': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      'Hoodie': 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
      'T-Shirt': 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
      // Add more category images as needed
    };
    return images[category] || 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9';
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