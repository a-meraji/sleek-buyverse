import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const brands = [
  { name: "SEIKO", logo: "/brands/seiko.svg" },
  { name: "ROLEX", logo: "/brands/rolex.svg" },
  { name: "QUARTZ", logo: "/brands/quartz.svg" },
  { name: "OMEGA", logo: "/brands/omega.svg" },
  { name: "CASIO", logo: "/brands/casio.svg" },
  { name: "TISSOT", logo: "/brands/tissot.svg" }
];

export function WatchBrands() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Brands</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-12 p-4">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="w-40 h-40 flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-24 h-24 object-contain"
                />
                <p className="mt-4 font-semibold">{brand.name}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}