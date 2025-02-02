import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Heart } from "lucide-react";

export default function BeautyStoreHero() {
  return (
    <section className="bg-[#fdf2f8] relative overflow-hidden">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-serif text-pink-900">
              Discover Your Natural Beauty
            </h1>
            <p className="text-xl text-gray-600">
              Premium skincare and beauty products for your daily routine.
            </p>
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
              <p className="text-sm text-gray-600">
                Join 10,000+ happy customers
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Sparkles className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Natural</p>
              </div>
              <div className="text-center">
                <Star className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Premium</p>
              </div>
              <div className="text-center">
                <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Cruelty-Free</p>
              </div>
            </div>
            <Button className="bg-pink-500 hover:bg-pink-600">
              Shop Collection
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"
              alt="Beauty Products"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}