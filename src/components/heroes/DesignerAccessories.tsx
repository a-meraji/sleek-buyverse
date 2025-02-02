import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, Award } from "lucide-react";

export default function DesignerAccessories() {
  return (
    <section className="bg-gradient-to-r from-purple-800 to-pink-800 text-white">
      <Container className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm">
            Luxury Accessories
          </span>
          <h1 className="text-6xl font-black">
            ELEVATE YOUR STYLE
          </h1>
          <p className="text-xl text-purple-200">
            Curated collection of designer bags, watches, and accessories.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <ShoppingBag className="h-8 w-8 text-purple-300 mb-4 mx-auto" />
              <h3 className="font-bold">Designer Bags</h3>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <Package className="h-8 w-8 text-purple-300 mb-4 mx-auto" />
              <h3 className="font-bold">Premium Packaging</h3>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <Award className="h-8 w-8 text-purple-300 mb-4 mx-auto" />
              <h3 className="font-bold">Authenticity</h3>
            </div>
          </div>
          <Button size="lg" className="bg-white text-purple-800 hover:bg-white/90">
            View Collection
          </Button>
        </div>
      </Container>
    </section>
  );
}