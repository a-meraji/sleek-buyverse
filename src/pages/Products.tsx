import { Navbar } from "@/components/Navbar";
import { ProductsContainer } from "@/components/products/ProductsContainer";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ProductsContainer />
      </main>
    </div>
  );
};

export default Products;