import { useNavigate } from "react-router-dom";

export const WatchCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    console.log('Navigating to category:', category);
    navigate(`/products?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  return (
    <div className="flex overflow-x-auto gap-4 py-4 px-2">
      {['Hat', 'Cap', 'Hoodie', 'T-Shirt'].map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className="px-4 py-2 whitespace-nowrap rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {category}
        </button>
      ))}
    </div>
  );
};