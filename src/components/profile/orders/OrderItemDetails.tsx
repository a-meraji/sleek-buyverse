import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ReviewDialog } from "../ReviewDialog";

interface OrderItemDetailsProps {
  item: any;
  showRateButton: boolean;
}

export const OrderItemDetails = ({ item, showRateButton }: OrderItemDetailsProps) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  if (!item.product) {
    console.log('Missing product data for order item:', item);
    return (
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded" />
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
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <p className="font-medium">{item.product.name}</p>
          {item.variant && (
            <p className="text-sm text-gray-500">
              Size: {item.variant.size}, Color: {item.variant.color}
            </p>
          )}
          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          {showRateButton && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 px-4 py-2 h-auto flex flex-col items-center gap-1"
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
      </div>
      <div>
        <p className="font-medium">${item.price_at_time}</p>
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