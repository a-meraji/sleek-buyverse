import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Clock, Search, Heart } from "lucide-react";

export default function VintageFashion() {
  return (
    <section className="bg-[#f4f1ea]">
      <Container className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="inline-block px-3 py-1 bg-[#8b4513] text-white rounded-full text-sm">
            Timeless Style
          </span>
          <h1 className="text-5xl font-serif text-[#8b4513]">
            Vintage Treasures
          </h1>
          <p className="text-xl text-gray-600">
            Curated collection of authentic vintage clothing and accessories.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Clock className="h-8 w-8 text-[#8b4513] mb-4 mx-auto" />
              <h3 className="font-medium">Authentic Pieces</h3>
              <p className="text-sm text-gray-500">Hand-picked items</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Search className="h-8 w-8 text-[#8b4513] mb-4 mx-auto" />
              <h3 className="font-medium">Verified Quality</h3>
              <p className="text-sm text-gray-500">Expert checked</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Heart className="h-8 w-8 text-[#8b4513] mb-4 mx-auto" />
              <h3 className="font-medium">Unique Finds</h3>
              <p className="text-sm text-gray-500">One of a kind</p>
            </div>
          </div>
          <Button className="bg-[#8b4513] hover:bg-[#723a0f]">
            Explore Collection
          </Button>
        </div>
      </Container>
    </section>
  );
}