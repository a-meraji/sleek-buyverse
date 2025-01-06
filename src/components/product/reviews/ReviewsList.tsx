import { Review } from "@/types";
import { Star } from "lucide-react";

interface ReviewsListProps {
  reviews: Review[];
}

export const ReviewsList = ({ reviews }: ReviewsListProps) => {
  if (!reviews?.length) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Customer Reviews</h2>
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-8">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {review.reviewer_first_name} {review.reviewer_last_name}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{review.title}</h3>
            <p className="text-gray-600">{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};