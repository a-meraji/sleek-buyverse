import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { Product } from "@/types";

interface FavoritesListProps {
  userId: string;
}

interface FavoriteProduct {
  product_id: string;
  products: Product;
}

export function FavoritesList({ userId }: FavoritesListProps) {
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      console.log('Fetching favorites for user:', userId);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          product_id,
          products:products(
            id,
            name,
            description,
            image_url,
            category,
            sku,
            product_variants(
              id,
              parameters,
              stock,
              price
            )
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
      
      console.log('Raw favorites data:', data);
      
      const transformedData = data?.map(item => {
        const product = item.products as unknown as Product;
        // Ensure price is set from the first variant if available
        if (product.product_variants && product.product_variants.length > 0) {
          product.price = product.product_variants[0].price;
        }
        return {
          product_id: item.product_id,
          products: product
        };
      });
      
      console.log('Transformed favorites data:', transformedData);
      return transformedData as FavoriteProduct[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error loading favorites. Please try again.
      </div>
    );
  }

  if (!favorites?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No favorite products yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((favorite) => (
        <ProductCard
          key={favorite.product_id}
          id={favorite.products.id}
          name={favorite.products.name}
          image={favorite.products.image_url}
          product_variants={favorite.products.product_variants}
        />
      ))}
    </div>
  );
}