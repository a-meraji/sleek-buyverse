import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Crown, Star, Sparkles } from "lucide-react";

export default function PremiumFashionBoutique() {
  return (
    <section className="bg-[#1a1a1a] text-white">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-serif">
              Premium Fashion <br />
              <span className="text-[#d4af37]">Boutique</span>
            </h1>
            <p className="text-xl text-gray-300">
              Exclusive designer pieces for the discerning fashion enthusiast.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Crown className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">Luxury Brands</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">VIP Service</p>
              </div>
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-sm">Limited Edition</p>
              </div>
            </div>
            <Button className="bg-[#d4af37] hover:bg-[#c4a037] text-black">
              Explore Collection
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
              alt="Premium Fashion"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}