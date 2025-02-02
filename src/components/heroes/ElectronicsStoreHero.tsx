import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Cpu, Battery, Wifi } from "lucide-react";

export default function ElectronicsStoreHero() {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <Container className="py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-200 text-sm">
              New Tech Arrivals
            </span>
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Future of Tech
            </h1>
            <p className="text-xl text-gray-300">
              Discover cutting-edge electronics that transform your digital lifestyle.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-lg">
                <Cpu className="h-6 w-6 text-blue-400 mb-2" />
                <p className="text-sm">Latest Processors</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-lg">
                <Battery className="h-6 w-6 text-blue-400 mb-2" />
                <p className="text-sm">Long Battery Life</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 backdrop-blur-lg">
                <Wifi className="h-6 w-6 text-blue-400 mb-2" />
                <p className="text-sm">Fast Connectivity</p>
              </div>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Shop Now
            </Button>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800"
              alt="Electronics"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}