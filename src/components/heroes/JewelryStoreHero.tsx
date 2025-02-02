import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Diamond, Shield, Award } from "lucide-react";

export default function JewelryStoreHero() {
  return (
    <section className="bg-[#1a1a1a] text-white">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-serif">
              Timeless Elegance <br />
              <span className="text-[#d4af37]">Crafted for You</span>
            </h1>
            <p className="text-xl text-gray-300">
              Discover our collection of handcrafted jewelry pieces.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Diamond className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">Premium Quality</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">Certified</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">Lifetime Warranty</p>
              </div>
            </div>
            <Button className="bg-[#d4af37] hover:bg-[#c4a037] text-black">
              View Collection
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"
              alt="Jewelry"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}