import { Product } from "@/types";
import { ProductImageCarousel } from "../ProductImageCarousel";
import { ProductDetailsSection } from "./ProductDetailsSection";
import { RelatedProducts } from "../RelatedProducts";

interface ProductContainerProps {
  product: Product;
  userId: string | null;
}

export const ProductContainer = ({ product, userId }: ProductContainerProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductImageCarousel 
          mainImage={product.image_url}
          additionalImages={product.product_images}
        />
        <ProductDetailsSection 
          product={product}
          userId={userId}
        />
      </div>

      <div className="mt-16">
        <RelatedProducts 
          currentProductId={product.id} 
          category={product.category} 
        />
      </div>
    </div>
  );
};