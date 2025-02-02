import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Award } from "lucide-react";

export default function DesignerShoes() {
  return (
    <section className="bg-[#1a1a1a] text-white">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-serif">
              Step into Luxury <br />
              <span className="text-[#d4af37]">Designer Shoes</span>
            </h1>
            <p className="text-xl text-gray-300">
              Exclusive collection of designer footwear.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <ShoppingBag className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">Luxury Brands</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">Premium Quality</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">Authenticity</p>
              </div>
            </div>
            <Button className="bg-[#d4af37] hover:bg-[#c4a037] text-black">
              Shop Collection
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800"
              alt="Designer Shoes"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}