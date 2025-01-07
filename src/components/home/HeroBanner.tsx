import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroBanner = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src="image1.jpg"
            alt="Product 1"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src="image2.jpg"
            alt="Product 2"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src="image3.jpg"
            alt="Product 3"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#ffffff88] px-4 z-10">
        <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto text-center gap-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Discover Our Latest Collection
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Explore our curated selection of premium products designed for your lifestyle.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
