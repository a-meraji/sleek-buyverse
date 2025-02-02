import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Sun } from "lucide-react";

export default function SustainableFashionHero() {
  return (
    <section className="bg-[#e9f5e9]">
      <Container className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Eco-Friendly Fashion
          </span>
          <h1 className="text-5xl font-serif text-green-900">
            Sustainable Style, <br /> Better Future
          </h1>
          <p className="text-xl text-gray-600">
            Fashion that respects both you and the planet.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Leaf className="h-8 w-8 text-green-600 mb-4 mx-auto" />
              <h3 className="font-medium text-gray-900">Organic Materials</h3>
              <p className="text-sm text-gray-500">100% Sustainable</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Recycle className="h-8 w-8 text-green-600 mb-4 mx-auto" />
              <h3 className="font-medium text-gray-900">Recycled Packaging</h3>
              <p className="text-sm text-gray-500">Zero Waste</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Sun className="h-8 w-8 text-green-600 mb-4 mx-auto" />
              <h3 className="font-medium text-gray-900">Solar Powered</h3>
              <p className="text-sm text-gray-500">Clean Energy</p>
            </div>
          </div>
          <Button className="bg-green-700 hover:bg-green-800">
            Shop Sustainable
          </Button>
        </div>
      </Container>
    </section>
  );
}