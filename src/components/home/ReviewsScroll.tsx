import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const reviews = [
  {
    id: 1,
    name: "Sarah Thompson",
    rating: 5,
    review: "I'm absolutely in love with the quality of these clothes! The attention to detail is remarkable, and the fit is perfect.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    review: "The customer service is exceptional, and the products exceed expectations. I've received so many compliments!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 4,
    review: "Beautiful designs and great quality materials. The shipping was fast, and everything arrived perfectly packaged.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: 4,
    name: "David Kim",
    rating: 5,
    review: "These pieces are timeless and versatile. Perfect for both casual and formal occasions.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    rating: 5,
    review: "The sustainability focus of this brand really resonates with me. Plus, the clothes are absolutely gorgeous!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
];

export function ReviewsScroll() {
  return (
    <section className="py-16 px-6 overflow-hidden bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          What Our Customers Say
        </h2>
        <div className="flex gap-6 animate-scroll" style={{ animationDuration: '20s' }}>
          <div className="flex gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-sm min-w-[300px] md:min-w-[400px] flex-shrink-0 animate-fade-in"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={review.image} alt={review.name} />
                    <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.review}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-6" aria-hidden="true">
            {reviews.map((review) => (
              <div
                key={`${review.id}-duplicate`}
                className="bg-white p-6 rounded-lg shadow-sm min-w-[300px] md:min-w-[400px] flex-shrink-0 animate-fade-in"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={review.image} alt={review.name} />
                    <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}