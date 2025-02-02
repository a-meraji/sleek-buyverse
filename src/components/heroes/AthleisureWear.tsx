import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Zap, Activity, Flame } from "lucide-react";

export default function AthleisureWear() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl font-black">
              MOVE IN STYLE
            </h1>
            <p className="text-xl text-blue-100">
              Performance meets fashion in our athleisure collection.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Zap className="h-6 w-6 text-yellow-400 mb-2" />
                <p className="text-sm">High Performance</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Activity className="h-6 w-6 text-yellow-400 mb-2" />
                <p className="text-sm">Active Comfort</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Flame className="h-6 w-6 text-yellow-400 mb-2" />
                <p className="text-sm">Stylish Design</p>
              </div>
            </div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
              Shop Collection
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1483721310020-03333e577078?w=800"
              alt="Athleisure"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}