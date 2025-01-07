import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FavoriteButtonProps {
  userId: string | null;
  productId: string;
}

export function FavoriteButton({ userId, productId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      const checkFavorite = async () => {
        const { data } = await supabase
          .from('favorites')
          .select()
          .eq('user_id', userId)
          .eq('product_id', productId)
          .single();
        
        setIsFavorite(!!data);
      };
      
      checkFavorite();
    }
  }, [userId, productId]);

  const handleAddToFavorites = async () => {
    if (!userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to favorites",
        variant: "destructive"
      });
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: "Product has been removed from your favorites"
      });
    } else {
      const { error } = await supabase
        .from('favorites')
        .upsert({ 
          user_id: userId,
          product_id: productId
        });

      if (error) throw error;
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: "Product has been added to your favorites"
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleAddToFavorites}
    >
      <Heart 
        className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
      />
    </Button>
  );
}