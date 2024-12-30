import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <div className="relative bg-white overflow-hidden
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 pt-14 lg:pt-20 lg:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Discover Your Style
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Explore our curated collection of premium fashion pieces designed for the modern lifestyle.
              </p>
              <div className="mt-10">
                <Link to="/products">
                  <Button className="bg-[#1d8757] hover:bg-[#1d8757]/90 text-white px-8 py-6 rounded-full text-lg animate-fade-in delay-200">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="relative h-full">
            <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                    <img
                      src="/home-page-03-hero-image-tile-01.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                    <img
                      src="/home-page-03-hero-image-tile-02.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                    <img
                      src="/home-page-03-hero-image-tile-03.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                    <img
                      src="/home-page-03-hero-image-tile-04.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                    <img
                      src="/home-page-03-hero-image-tile-05.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                    <img
                      src="/home-page-03-hero-image-tile-06.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                    <img
                      src="/home-page-03-hero-image-tile-07.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
