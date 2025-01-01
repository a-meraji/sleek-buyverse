import { Product } from "@/types";
import { ProductCarousel } from "./ProductCarousel";
import { StyleShowcase } from "./StyleShowcase";
import { ReviewsScroll } from "./ReviewsScroll";
import { Button } from "@/components/ui/button";
import { Grid } from "lucide-react";
import { Link } from "react-router-dom";

interface MainContentProps {
  products: Product[];
}

export const MainContent = ({ products }: MainContentProps) => {
  console.log('Rendering MainContent with products:', products);
  
  return (
    <>
      <ProductCarousel title="New Arrivals" products={products} />
      <StyleShowcase />
      <ProductCarousel title="Popular Products" products={products} />
      <ReviewsScroll />
      <div className="py-16 px-6 text-center">
        <Link to="/products">
          <Button className="bg-[#1d8757] hover:bg-[#1d8757]/90 text-white px-8 py-6 rounded-full text-lg">
            <Grid className="mr-2 h-5 w-5" />
            View All Products
          </Button>
        </Link>
      </div>
    </>
  );
};