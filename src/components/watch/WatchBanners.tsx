import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: 1,
    image: "/banners/luxury-watches.jpg",
    title: "Luxury Collection",
    subtitle: "Discover our premium selection"
  },
  {
    id: 2,
    image: "/banners/smart-watches.jpg",
    title: "Smart Watches",
    subtitle: "Stay connected in style"
  },
  {
    id: 3,
    image: "/banners/special-offer.jpg",
    title: "Special Offer",
    subtitle: "Up to 40% off on selected items"
  }
];

export function WatchBanners() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const previousBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentBanner * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 relative"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-[60vh] object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                <p className="text-xl">{banner.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={previousBanner}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={nextBanner}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentBanner === index ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentBanner(index)}
          />
        ))}
      </div>
    </div>
  );
}