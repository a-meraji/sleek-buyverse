import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Droplet, Leaf, Sun } from "lucide-react";

export default function LuxurySkincare() {
  return (
    <section className="bg-gradient-to-r from-rose-100 to-teal-100">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-serif text-gray-900">
              Luxury Skincare <br />
              <span className="text-teal-600">For Your Ritual</span>
            </h1>
            <p className="text-xl text-gray-600">
              Advanced formulations for radiant, healthy skin.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Droplet className="h-6 w-6 text-teal-500 mb-2" />
                <p className="text-sm text-gray-600">Hydrating</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Leaf className="h-6 w-6 text-teal-500 mb-2" />
                <p className="text-sm text-gray-600">Natural</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Sun className="h-6 w-6 text-teal-500 mb-2" />
                <p className="text-sm text-gray-600">Protective</p>
              </div>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Shop Skincare
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800"
              alt="Luxury Skincare"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}