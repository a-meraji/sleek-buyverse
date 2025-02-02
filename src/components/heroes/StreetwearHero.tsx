import { Container } from "@/components/ui/container";
import { Star, Sparkles, Heart } from "lucide-react";

export default function StreetwearHero() {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <Container className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
            New Collection Drop
          </span>
          <h1 className="text-6xl font-black">
            STREET <br /> CULTURE
          </h1>
          <p className="text-xl text-purple-100">
            Express yourself with our latest streetwear collection.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <Star className="h-8 w-8 text-yellow-400 mb-4" />
              <h3 className="font-bold">Limited Edition</h3>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <Sparkles className="h-8 w-8 text-yellow-400 mb-4" />
              <h3 className="font-bold">Exclusive Drops</h3>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <Heart className="h-8 w-8 text-yellow-400 mb-4" />
              <h3 className="font-bold">Member Access</h3>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}