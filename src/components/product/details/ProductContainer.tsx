import { Product } from "@/types";
import { ProductImageCarousel } from "../ProductImageCarousel";
import { ProductDetailsSection } from "./ProductDetailsSection";
import { RelatedProducts } from "../RelatedProducts";
import { ReviewsList } from "../reviews/ReviewsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductContainerProps {
  product: Product;
  userId?: string | null;
}

export function ProductContainer({ product, userId }: ProductContainerProps) {
  const { data: reviews } = useQuery({
    queryKey: ['product-reviews', product.id],
    queryFn: async () => {
      console.log('Fetching reviews for product:', product.id);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      console.log('Reviews fetched:', data);
      return data;
    }
  });

  return (
    <div className="space-y-16">
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
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RelatedProducts 
          currentProductId={product.id} 
          mainCategory={product.main_category}
          secondaryCategories={product.secondary_categories as string[]}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ReviewsList reviews={reviews || []} />
      </div>
    </div>
  );
}