import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Minimize2, Square, Circle } from "lucide-react";

export default function MinimalistFashion() {
  return (
    <section className="bg-white">
      <Container className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-light text-gray-900">
            Less is More
          </h1>
          <p className="text-xl text-gray-600">
            Timeless minimalist fashion for the modern wardrobe.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <Minimize2 className="h-8 w-8 text-gray-900 mb-4 mx-auto" />
              <h3 className="font-light">Essential Pieces</h3>
              <p className="text-sm text-gray-500">Versatile designs</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <Square className="h-8 w-8 text-gray-900 mb-4 mx-auto" />
              <h3 className="font-light">Clean Lines</h3>
              <p className="text-sm text-gray-500">Modern aesthetics</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <Circle className="h-8 w-8 text-gray-900 mb-4 mx-auto" />
              <h3 className="font-light">Quality Focus</h3>
              <p className="text-sm text-gray-500">Premium materials</p>
            </div>
          </div>
          <Button className="bg-gray-900 hover:bg-gray-800">
            View Collection
          </Button>
        </div>
      </Container>
    </section>
  );
}