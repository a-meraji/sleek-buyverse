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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
              <p className="mt-4 font-semibold text-sm sm:text-base">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}