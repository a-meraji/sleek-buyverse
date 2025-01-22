import { useState } from "react";
import { Product } from "@/types";
import { ProductDetails } from "../ProductDetails";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductDetailsSectionProps {
  product: Product;
  userId: string | null;
}

export const ProductDetailsSection = ({ product, userId }: ProductDetailsSectionProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const handleFavoriteToggle = async () => {
    if (!userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to favorites",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', product.id);

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
            product_id: product.id
          });

        if (error) throw error;
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Product has been added to your favorites"
        });
      }
    } catch (error) {
      console.error('Error managing favorites:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <ProductDetails
          product={product}
          userId={userId}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteToggle}
          className="mt-1"
        >
          <Heart 
            className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </Button>
      </div>
    </div>
  );
};