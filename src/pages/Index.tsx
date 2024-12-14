import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";

// Temporary mock data until we integrate with Medusa
const products = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    price: 29.99,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    price: 79.99,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Cotton Sweater",
    price: 59.99,
    image: "/placeholder.svg",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">New Arrivals</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;