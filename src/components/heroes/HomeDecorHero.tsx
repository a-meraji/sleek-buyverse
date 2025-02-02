import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Truck, Shield } from "lucide-react";

export default function HomeDecorHero() {
  return (
    <section className="bg-[#f8f5f0]">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-light text-gray-800">
              Transform Your Space
            </h1>
            <p className="text-xl text-gray-600">
              Discover unique home decor pieces that reflect your personal style.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-gray-600 mb-2" />
                <p className="text-sm text-gray-600">Free Shipping</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-gray-600 mb-2" />
                <p className="text-sm text-gray-600">Quality Guarantee</p>
              </div>
            </div>
            <Button className="bg-gray-900 hover:bg-gray-800">
              Shop Now
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=400"
              alt="Home Decor"
              className="rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400"
              alt="Home Decor"
              className="rounded-lg mt-8"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}