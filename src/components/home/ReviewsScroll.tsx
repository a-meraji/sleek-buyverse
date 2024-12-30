import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah Thompson",
    title: "Can't say enough good things",
    rating: 5,
    review: "I was absolutely delighted with my purchase! The quality exceeded my expectations, and the customer service was exceptional. I've already recommended this store to all my friends.",
    date: "May 16, 2023",
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Outstanding Quality and Service",
    rating: 5,
    review: "The attention to detail is remarkable. Every aspect of my order was handled with care, from the packaging to the product itself. Truly a premium experience.",
    date: "June 21, 2023",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Exceeded All Expectations",
    rating: 4,
    review: "Beautiful designs and great quality materials. The shipping was fast, and everything arrived perfectly packaged. Will definitely shop here again!",
    date: "July 5, 2023",
  },
  {
    id: 4,
    name: "David Kim",
    title: "Perfect for Any Occasion",
    rating: 5,
    review: "These pieces are timeless and versatile. Perfect for both casual and formal occasions. The quality is outstanding!",
    date: "August 12, 2023",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    title: "Sustainable and Stylish",
    rating: 5,
    review: "Love the sustainability focus of this brand. The clothes are gorgeous and knowing they're made responsibly makes them even better!",
    date: "September 3, 2023",
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Fantastic Customer Experience",
    rating: 5,
    review: "From browsing to delivery, everything was smooth and professional. The product quality is outstanding, and the packaging was eco-friendly!",
    date: "October 15, 2023",
  },
  {
    id: 7,
    name: "Anna Martinez",
    title: "Worth Every Penny",
    rating: 5,
    review: "The quality justifies the price point. These are investment pieces that will last for years. Couldn't be happier with my purchase!",
    date: "November 8, 2023",
  },
  {
    id: 8,
    name: "Robert Taylor",
    title: "Impressive Attention to Detail",
    rating: 4,
    review: "The craftsmanship is evident in every stitch. The materials used are top-notch, and the fit is perfect. Very satisfied customer!",
    date: "December 1, 2023",
  },
  {
    id: 9,
    name: "Sophie Brown",
    title: "Amazing Shopping Experience",
    rating: 5,
    review: "The website was easy to navigate, shipping was fast, and the products are even better in person. Will definitely be a repeat customer!",
    date: "January 20, 2024",
  },
  {
    id: 10,
    name: "Thomas Lee",
    title: "Exceptional Quality",
    rating: 5,
    review: "The quality of these products is unmatched. Everything from the materials to the construction shows incredible attention to detail.",
    date: "February 5, 2024",
  },
];

export function ReviewsScroll() {
  return (
    <section className="py-16 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          What Our Customers Say
        </h2>
        <div className="relative">
          {/* Fade overlay at the top */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-secondary to-transparent z-10" />
          
          {/* Reviews container with custom scrolling animation */}
          <div className="relative overflow-hidden h-[80vh] md:h-[50vh]">
            <div className="absolute inset-0 overflow-hidden">
              <div className="animate-scroll-vertical">
                <div className="space-y-6">
                  {[...reviews, ...reviews].map((review, index) => (
                    <div
                      key={`${review.id}-${index}`}
                      className="bg-white p-6 rounded-lg shadow-sm animate-fade-in"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                      <p className="text-gray-600 mb-4">{review.review}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{review.name}</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Fade overlay at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-secondary to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}