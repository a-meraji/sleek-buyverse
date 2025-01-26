import { Product } from "@/types";
import { ProductImageCarousel } from "../ProductImageCarousel";
import { ProductDetailsSection } from "./ProductDetailsSection";

interface ProductContainerProps {
  product: Product;
  userId?: string | null;
}

export function ProductContainer({ product, userId }: ProductContainerProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        <div className="lg:col-span-1">
          <ProductImageCarousel 
            mainImage={product.image_url} 
            additionalImages={product.product_images}
          />
        </div>
        <div className="lg:col-span-1">
          <ProductDetailsSection 
            product={product}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}