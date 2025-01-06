import { Product } from "@/types";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { StyleShowcase } from "@/components/home/StyleShowcase";
import { ReviewsScroll } from "@/components/home/ReviewsScroll";
import { ViewAllProductsButton } from "@/components/home/ViewAllProductsButton";

interface MainContentProps {
  products: Product[];
  popularProducts: Product[];
}

export const MainContent = ({ products, popularProducts }: MainContentProps) => {
  if (!products?.length) return null;

  console.log('MainContent rendering with popularProducts:', popularProducts);

  return (
    <>
      <ProductCarousel title="New Arrivals" products={products} />
      <StyleShowcase />
      {popularProducts?.length > 0 && (
        <ProductCarousel 
          title="Popular Products" 
          products={popularProducts} 
        />
      )}
      <ReviewsScroll />
      <ViewAllProductsButton />
    </>
  );
};