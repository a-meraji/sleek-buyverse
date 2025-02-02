import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Heart } from "lucide-react";

export default function HighEndCosmetics() {
  return (
    <section className="bg-[#fdf2f8]">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-serif text-gray-900">
              Luxury Beauty <br />
              <span className="text-pink-600">Essentials</span>
            </h1>
            <p className="text-xl text-gray-600">
              Premium cosmetics for the sophisticated beauty enthusiast.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Sparkles className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Premium Quality</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Star className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Dermatologist Tested</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Cruelty Free</p>
              </div>
            </div>
            <Button className="bg-pink-600 hover:bg-pink-700">
              Shop Now
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
              alt="Cosmetics"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}