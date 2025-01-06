import { useRelatedProducts } from "./related/useRelatedProducts";
import { usePopularProducts } from "./related/usePopularProducts";
import { ProductCarouselWrapper } from "./related/ProductCarouselWrapper";

interface RelatedProductsProps {
  currentProductId: string;
  category: string | null;
}

export const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const { data: relatedProducts, isLoading: isLoadingRelated } = useRelatedProducts({
    currentProductId,
    category
  });

  const { data: popularProducts, isLoading: isLoadingPopular } = usePopularProducts(currentProductId);

  if (isLoadingRelated || isLoadingPopular) return null;

  // If there are related products, show them
  if (relatedProducts && relatedProducts.length > 0) {
    return (
      <ProductCarouselWrapper
        title="Related Products"
        products={relatedProducts}
      />
    );
  }

  // If no related products but we have popular products, show those instead
  if (popularProducts && popularProducts.length > 0) {
    return (
      <ProductCarouselWrapper
        title="Popular Products"
        products={popularProducts}
      />
    );
  }

  // If neither related nor popular products are available, return null
  return null;
};