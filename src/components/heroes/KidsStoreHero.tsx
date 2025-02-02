import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Smile } from "lucide-react";

export default function KidsStoreHero() {
  return (
    <section className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold">
              Fun & Safe Fashion for Kids
            </h1>
            <p className="text-xl">
              Colorful, comfortable, and child-friendly clothing.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <Heart className="h-6 w-6 text-white mb-2" />
                <p className="text-sm">Comfort First</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white mb-2" />
                <p className="text-sm">Safe Materials</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <Smile className="h-6 w-6 text-white mb-2" />
                <p className="text-sm">Kid Approved</p>
              </div>
            </div>
            <Button className="bg-white text-purple-500 hover:bg-white/90">
              Shop Kids Collection
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800"
              alt="Kids Fashion"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}