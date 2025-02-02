import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LuxuryFashionHero() {
  return (
    <section className="relative overflow-hidden bg-[#1a1a1a] text-white">
      <Container className="relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-serif leading-tight">
              Discover Luxury <br />
              <span className="text-[#c4a47c]">Fashion</span>
            </h1>
            <p className="text-lg text-gray-300">
              Explore our curated collection of designer pieces that define elegance.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-[#c4a47c] hover:bg-[#b39371]">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
              alt="Luxury Fashion"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}