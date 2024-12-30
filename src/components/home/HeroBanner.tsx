import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden mt-8">
      <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Discover Your Style
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Explore our curated collection of premium fashion pieces designed for the modern lifestyle.
            </p>
            <div className="mt-10">
              <Link to="/products">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative image grid */}
          <div
            aria-hidden="true"
            className="relative mt-10 overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <img
                    src="/home-page-03-hero-image-tile-01.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <img
                    src="/home-page-03-hero-image-tile-02.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <img
                    src="/home-page-03-hero-image-tile-03.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <img
                    src="/home-page-03-hero-image-tile-04.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <img
                    src="/home-page-03-hero-image-tile-05.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <img
                    src="/home-page-03-hero-image-tile-06.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <img
                    src="/home-page-03-hero-image-tile-07.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}