import { Badge } from "@/components/ui/badge";
import { Percent, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductHeaderProps {
  name: string;
  discount?: number | null;
  productId: string;
  brand?: string | null;
}

export const ProductHeader = ({ name, discount, productId, brand }: ProductHeaderProps) => {
  const hasValidDiscount = typeof discount === 'number' && discount > 0 && discount <= 100;

  const { data: reviews } = useQuery({
    queryKey: ['product-reviews-rating', productId],
    queryFn: async () => {
      console.log('Fetching approved reviews for rating calculation:', productId);
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching reviews for rating:', error);
        throw error;
      }

      console.log('Fetched reviews for rating:', data);
      return data || [];
    }
  });

  const averageRating = reviews?.length 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{name}</h1>
      {brand && (
        <div className="text-sm text-muted-foreground">
          by {brand}
        </div>
      )}
      <div className="flex items-center gap-4">
        {hasValidDiscount && (
          <Badge className="bg-red-500 text-white">
            <Percent className="h-4 w-4 mr-1" />
            {discount}% OFF
          </Badge>
        )}
        {averageRating && (
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{averageRating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};