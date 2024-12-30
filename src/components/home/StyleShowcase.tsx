import { Sparkles } from "lucide-react";

export function StyleShowcase() {
  return (
    <section className="py-16 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#1d8757]">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium">Premium Quality</span>
          </div>
          <h2 className="text-3xl font-bold">
            Crafted with Excellence,{" "}
            <span className="text-[#1d8757]">Designed for You</span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our products are meticulously crafted using the finest materials,
            ensuring both style and durability. Each piece is designed with
            attention to detail, making sure you look and feel your best.
          </p>
        </div>
        <div className="relative">
          <img
            src="https://7252cacb-ebf1-404f-9aa9-4da107bb05a9.lovableproject.com/product/75cb567f-ded6-4f80-8116-43b7818d10d9"
            alt="Style Showcase"
            className="rounded-lg shadow-xl animate-fade-in"
          />
          <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg animate-fade-in delay-100">
            <p className="text-[#1d8757] font-medium">Premium Materials</p>
            <p className="text-sm text-gray-600">100% Quality Guaranteed</p>
          </div>
        </div>
      </div>
    </section>
  );
}