import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function WatchBrands() {
  const navigate = useNavigate();
  
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      console.log('Fetching brands');
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
      
      console.log('Fetched brands:', data);
      return data || [];
    }
  });

  const handleBrandClick = (brandName: string) => {
    console.log('Navigating to products with brand:', brandName);
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Brands</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Brands</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.name)}
              className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
            >
              <p className="font-semibold text-sm sm:text-base">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}