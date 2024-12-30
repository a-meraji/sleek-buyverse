import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah Thompson",
    rating: 5,
    review: "I'm absolutely in love with the quality of these clothes! The attention to detail is remarkable, and the fit is perfect. Best purchase I've made in a long time.",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    review: "The customer service is exceptional, and the products exceed expectations. I've received so many compliments on my new outfits!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 4,
    review: "Beautiful designs and great quality materials. The shipping was fast, and everything arrived perfectly packaged.",
  },
  {
    id: 4,
    name: "David Kim",
    rating: 5,
    review: "These pieces are timeless and versatile. I can mix and match them easily, and they're perfect for both casual and formal occasions.",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    rating: 5,
    review: "The sustainability focus of this brand really resonates with me. Plus, the clothes are absolutely gorgeous!",
  },
  {
    id: 6,
    name: "James Wilson",
    rating: 4,
    review: "Great value for money. The quality is outstanding, and the styles are modern yet classic.",
  },
  {
    id: 7,
    name: "Maria Garcia",
    rating: 5,
    review: "I appreciate how inclusive the sizing is. Finally found a brand that makes me feel confident and beautiful!",
  },
  {
    id: 8,
    name: "Alex Turner",
    rating: 5,
    review: "The attention to detail in every piece is remarkable. These clothes make me feel like a million bucks!",
  },
  {
    id: 9,
    name: "Sophie Martin",
    rating: 4,
    review: "Love the minimalist aesthetic and the quality of the fabrics. Will definitely be a returning customer!",
  },
  {
    id: 10,
    name: "Ryan Patel",
    rating: 5,
    review: "The fit is perfect, and the style is exactly what I was looking for. Highly recommend!",
  },
];

export function ReviewsScroll() {
  return (
    <section className="py-16 px-6 overflow-hidden bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          What Our Customers Say
        </h2>
        <div className="flex gap-6 animate-scroll">
          <div className="flex gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-sm min-w-[300px] md:min-w-[400px] flex-shrink-0"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.review}</p>
                <p className="font-medium">{review.name}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-6" aria-hidden="true">
            {reviews.map((review) => (
              <div
                key={`${review.id}-duplicate`}
                className="bg-white p-6 rounded-lg shadow-sm min-w-[300px] md:min-w-[400px] flex-shrink-0"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.review}</p>
                <p className="font-medium">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}