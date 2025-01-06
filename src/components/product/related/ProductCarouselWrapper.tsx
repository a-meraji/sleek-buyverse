import { Product } from "@/types";
import { ProductCarousel } from "@/components/home/ProductCarousel";

interface ProductCarouselWrapperProps {
  title: string;
  products: Product[];
}

export const ProductCarouselWrapper = ({ title, products }: ProductCarouselWrapperProps) => {
  if (!products?.length) return null;

  return (
    <ProductCarousel
      title={title}
      products={products}
    />
  );
};