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
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-12 w-max">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="w-40 h-40 flex-shrink-0 flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
        </div>
      </div>
    </section>
  );
}