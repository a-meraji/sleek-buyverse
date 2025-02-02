import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Sofa, Truck, Clock } from "lucide-react";

export default function FurnitureStoreHero() {
  return (
    <section className="bg-[#f8f5f0]">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-light text-gray-800">
              Design Your Perfect Space
            </h1>
            <p className="text-xl text-gray-600">
              Curated furniture collection for modern living.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <Sofa className="h-6 w-6 text-gray-600 mb-2" />
                <p className="text-sm text-gray-600">Quality Crafted</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-gray-600 mb-2" />
                <p className="text-sm text-gray-600">Free Delivery</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <Clock className="h-6 w-6 text-gray-600 mb-2" />
                <p className="text-sm text-gray-600">Fast Assembly</p>
              </div>
            </div>
            <Button className="bg-gray-900 hover:bg-gray-800">
              Explore Now
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400"
              alt="Furniture"
              className="rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=400"
              alt="Furniture"
              className="rounded-lg mt-8"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}