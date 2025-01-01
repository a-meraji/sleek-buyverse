import { Loader2 } from "lucide-react";
import { EmptyFavorites } from "../favorites/EmptyFavorites";
import { FavoritesError } from "../favorites/FavoritesError";
import { FavoritesGrid } from "../favorites/FavoritesGrid";
import { useFavorites } from "../favorites/useFavorites";

interface FavoritesListProps {
  userId: string;
}

export function FavoritesList({ userId }: FavoritesListProps) {
  const { data: favorites, isLoading, error } = useFavorites(userId);

  console.log('FavoritesList rendering state:', { isLoading, error, favoritesCount: favorites?.length });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <FavoritesError />;
  }

  if (!favorites?.length) {
    return <EmptyFavorites />;
  }

  return <FavoritesGrid favorites={favorites} />;
}