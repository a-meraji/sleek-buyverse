import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ReviewDialog } from "../ReviewDialog";
import { supabase } from "@/integrations/supabase/client";

interface OrderItemDetailsProps {
  item: any;
  showRateButton: boolean;
}

export const OrderItemDetails = ({ item, showRateButton }: OrderItemDetailsProps) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const checkUserReview = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id || !item.product?.id) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .single();

        if (!profile) return;

        const { data: reviews } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', item.product.id)
          .eq('reviewer_first_name', profile.first_name)
          .eq('reviewer_last_name', profile.last_name);

        setHasReviewed(reviews && reviews.length > 0);
      } catch (error) {
        console.error('Error checking user review:', error);
      }
    };

    if (showRateButton && item.product?.id) {
      checkUserReview();
    }
  }, [showRateButton, item.product?.id]);

  if (!item.product) {
    console.log('Missing product data for order item:', item);
    return (
      <div className="flex items-center justify-between border-b pb-6 px-4">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gray-200 rounded-lg" />
          <div>
            <p className="font-medium text-gray-500">Product not available</p>
            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          </div>
        </div>
        <p className="font-medium">${item.price_at_time}</p>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between border-b pb-6 px-4 hover:bg-gray-50/50 transition-colors">
      <div className="flex space-x-6">
        <div className="relative">
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded-lg shadow-sm"
          />
          {showRateButton && !hasReviewed && (
            <Button
              variant="outline"
              size="sm"
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 h-auto flex flex-col items-center gap-0.5 bg-white shadow-sm border-gray-200"
              onClick={() => setIsReviewDialogOpen(true)}
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 text-gray-300"
                  />
                ))}
              </div>
              <span className="text-xs font-light">Rate Product</span>
            </Button>
          )}
        </div>
        <div className="space-y-1">
          <p className="font-medium text-gray-900">{item.product.name}</p>
          {item.variant && (
            <p className="text-sm text-gray-600">
              Size: {item.variant.size}, Color: {item.variant.color}
            </p>
          )}
          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">${item.price_at_time}</p>
        <ReviewDialog
          isOpen={isReviewDialogOpen}
          onClose={() => setIsReviewDialogOpen(false)}
          productId={item.product.id}
          defaultValues={{
            reviewer_first_name: "",
            reviewer_last_name: "",
          }}
        />
      </div>
    </div>
  );
};