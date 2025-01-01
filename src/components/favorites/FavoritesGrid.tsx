import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

interface FavoriteProduct {
  product_id: string;
  products: Product;
}

interface FavoritesGridProps {
  favorites: FavoriteProduct[];
}

export function FavoritesGrid({ favorites }: FavoritesGridProps) {
  console.log('Rendering FavoritesGrid with favorites:', favorites);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((favorite) => (
        <ProductCard
          key={favorite.product_id}
          id={favorite.products.id}
          name={favorite.products.name}
          image={favorite.products.image_url}
          product_variants={favorite.products.product_variants}
          discount={favorite.products.discount}
        />
      ))}
    </div>
  );
}