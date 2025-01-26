import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

export function FavoritesList() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch favorites from local storage or API
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  const getProductPrice = (product: Product) => {
    return product.product_variants?.[0]?.price ?? 0;
  };

  const handleRemoveFavorite = (productId: string) => {
    const updatedFavorites = favorites.filter(product => product.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Favorites</h2>
      <ul>
        {favorites.map(product => (
          <li key={product.id} className="flex justify-between items-center">
            <span>{product.name}</span>
            <span>${getProductPrice(product).toFixed(2)}</span>
            <Button onClick={() => handleRemoveFavorite(product.id)}>Remove</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
