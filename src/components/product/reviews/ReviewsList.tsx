import { Review } from "@/types";
import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ReviewsListProps {
  reviews: Review[];
}

const MAX_VISIBLE_LENGTH = 150;
const INITIAL_REVIEWS_COUNT = 3;

export const ReviewsList = ({ reviews }: ReviewsListProps) => {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [visibleReviews, setVisibleReviews] = useState(INITIAL_REVIEWS_COUNT);

  if (!reviews?.length) {
    return null;
  }

  const toggleReview = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const loadMore = () => {
    setVisibleReviews(prev => prev + INITIAL_REVIEWS_COUNT);
  };

  const displayedReviews = reviews.slice(0, visibleReviews);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Customer Reviews</h2>
      <div className="space-y-8">
        {displayedReviews.map((review) => (
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
            {review.review_text.length > MAX_VISIBLE_LENGTH ? (
              <Collapsible>
                <p className="text-gray-600">
                  {review.review_text.slice(0, MAX_VISIBLE_LENGTH)}
                  {!expandedReviews.includes(review.id) && "..."}
                </p>
                <CollapsibleContent>
                  <p className="text-gray-600 mt-2">
                    {review.review_text.slice(MAX_VISIBLE_LENGTH)}
                  </p>
                </CollapsibleContent>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="link" 
                    className="mt-2 p-0 h-auto"
                    onClick={() => toggleReview(review.id)}
                  >
                    {expandedReviews.includes(review.id) ? "Read less" : "Read more"}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            ) : (
              <p className="text-gray-600">{review.review_text}</p>
            )}
          </div>
        ))}
      </div>
      {reviews.length > visibleReviews && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore} variant="secondary">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};