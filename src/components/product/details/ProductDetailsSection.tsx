import { Product } from "@/types";
import { ProductDetails } from "./ProductDetails";
import { RelatedProducts } from "../RelatedProducts";

interface ProductDetailsSectionProps {
  product: Product;
  userId: string | null;
}

export function ProductDetailsSection({ product, userId }: ProductDetailsSectionProps) {
  return (
    <div className="space-y-8 py-8">
      <ProductDetails product={product} userId={userId} />
      <RelatedProducts 
        currentProductId={product.id} 
        mainCategory={product.main_category}
        secondaryCategories={product.secondary_categories as string[]}
      />
    </div>
  );
}