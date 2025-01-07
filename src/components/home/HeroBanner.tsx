import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden  mt-8">
    <div className="pb-80 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
      <div className="relative mx-auto max-w-7xl sm:static sm:px-6 lg:px-8 lg:flex">
        <div className="relative sm:max-w-lg z-10">
         <div className="bg-gradient-to-t from-transparent  to-[#ffffff88] px-4 ">
      <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-6xl">
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
        </div>

          {/* Decorative image grid */}
          <div>
                {/* Decorative image grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                >
                  <div className="absolute transform sm:right-1/2 top-0 sm:translate-x-8 lg:right-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
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
      </div>
    </div>
  );
}
