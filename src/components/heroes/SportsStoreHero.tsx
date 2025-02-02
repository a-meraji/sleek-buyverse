import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Timer, Trophy, Target } from "lucide-react";

export default function SportsStoreHero() {
  return (
    <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
      <Container className="py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl font-black">
            PUSH YOUR LIMITS
          </h1>
          <p className="text-xl text-white/90">
            High-performance gear for athletes who demand the best.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <Timer className="h-8 w-8 text-white mb-4 mx-auto" />
              <h3 className="font-bold">Fast Delivery</h3>
              <p className="text-sm text-white/80">24h Shipping</p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <Trophy className="h-8 w-8 text-white mb-4 mx-auto" />
              <h3 className="font-bold">Premium Quality</h3>
              <p className="text-sm text-white/80">Best Materials</p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <Target className="h-8 w-8 text-white mb-4 mx-auto" />
              <h3 className="font-bold">Pro Equipment</h3>
              <p className="text-sm text-white/80">For Champions</p>
            </div>
          </div>
          <Button size="lg" className="bg-white text-green-600 hover:bg-white/90">
            Start Shopping
          </Button>
        </div>
      </Container>
    </section>
  );
}