import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

interface FavoritesListProps {
  userId: string;
}

export function FavoritesList({ userId }: FavoritesListProps) {
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          product_id,
          products (
            id,
            name,
            image_url,
            product_variants (*)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
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