import { Product } from "@/types";
import { ProductImageCarousel } from "../ProductImageCarousel";
import { ProductDetailsSection } from "./ProductDetailsSection";
import { RelatedProducts } from "../RelatedProducts";
import { ReviewsList } from "../reviews/ReviewsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductContainerProps {
  product: Product;
  userId: string | null;
}

export const ProductContainer = ({ product, userId }: ProductContainerProps) => {
  const { data: reviews } = useQuery({
    queryKey: ['product-reviews', product.id],
    queryFn: async () => {
      console.log('Fetching approved reviews for product:', product.id);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      console.log('Fetched reviews:', data);
      return data || [];
    }
  });

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

      <ReviewsList reviews={reviews || []} />
    </div>
  );
};