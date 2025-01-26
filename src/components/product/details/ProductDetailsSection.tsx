import { Product } from "@/types";
import { ProductDetails } from "./ProductDetails";

interface ProductDetailsSectionProps {
  product: Product;
  userId: string | null;
}

export function ProductDetailsSection({ product, userId }: ProductDetailsSectionProps) {
  return (
    <div className="space-y-8 py-8">
      <ProductDetails product={product} userId={userId} />
    </div>
  );
}