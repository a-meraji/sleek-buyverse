import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  name: string;
  image: string;
}

export function WatchCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([
    { name: "Luxury", image: "/watches/luxury.jpg" },
    { name: "Sport", image: "/watches/sport.jpg" },
    { name: "Smart", image: "/watches/smart.jpg" },
    { name: "Classic", image: "/watches/classic.jpg" },
    { name: "Digital", image: "/watches/digital.jpg" }
  ]);

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category.toLowerCase()}`);
  };

  return (
    <div className="py-6 overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="flex-shrink-0 group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary p-0.5 group-hover:ring-4 transition-all">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <p className="mt-2 text-sm text-center">{category.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}