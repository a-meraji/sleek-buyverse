import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-secondary py-32 px-6 flex items-center min-h-[600px]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/50" />
        <img
          src="/hero-banner.jpg"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary animate-fade-in">
          Discover Your Style
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-600 animate-fade-in delay-100">
          Explore our curated collection of premium fashion pieces designed for the modern lifestyle.
        </p>
        <Link to="/products">
          <Button className="bg-[#1d8757] hover:bg-[#1d8757]/90 text-white px-8 py-6 rounded-full text-lg animate-fade-in delay-200">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  );
}