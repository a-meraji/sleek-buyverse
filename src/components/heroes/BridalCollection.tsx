import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heart, Star, Sparkles } from "lucide-react";

export default function BridalCollection() {
  return (
    <section className="bg-gradient-to-r from-pink-50 to-rose-50">
      <Container className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
            Bridal Collection
          </span>
          <h1 className="text-5xl font-serif text-gray-900">
            Your Perfect Day <br />
            <span className="text-pink-700">Awaits</span>
          </h1>
          <p className="text-xl text-gray-600">
            Exquisite wedding dresses and bridal accessories.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Heart className="h-8 w-8 text-pink-500 mb-4 mx-auto" />
              <h3 className="font-medium">Custom Fitting</h3>
              <p className="text-sm text-gray-500">Perfect fit guaranteed</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Star className="h-8 w-8 text-pink-500 mb-4 mx-auto" />
              <h3 className="font-medium">Premium Quality</h3>
              <p className="text-sm text-gray-500">Finest materials</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Sparkles className="h-8 w-8 text-pink-500 mb-4 mx-auto" />
              <h3 className="font-medium">Expert Styling</h3>
              <p className="text-sm text-gray-500">Personal consultation</p>
            </div>
          </div>
          <Button className="bg-pink-700 hover:bg-pink-800">
            Book Appointment
          </Button>
        </div>
      </Container>
    </section>
  );
}