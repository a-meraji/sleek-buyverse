import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProductHeader } from "./ProductHeader";
import { PriceDisplay } from "./PriceDisplay";
import { ProductVariantSection } from "./ProductVariantSection";
import { RichTextContent } from "../RichTextContent";

interface ProductDetailsProps {
  product: Product;
  userId: string | null;
}

export const ProductDetails = ({ product, userId }: ProductDetailsProps) => {
  const [selectedParameters, setSelectedParameters] = useState<Record<string, string | number>>({});

  const { data: variants, isLoading: isLoadingVariants } = useQuery({
    queryKey: ['product-variants', product.id],
    queryFn: async () => {
      console.log('Fetching variants for product details:', product.id);
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id);

      if (error) {
        console.error('Error fetching variants:', error);
        throw error;
      }

      console.log('Variants fetched for product details:', data);
      return data;
    }
  });

  const selectedVariant = variants?.find(v => 
    Object.entries(selectedParameters).every(
      ([key, value]) => v.parameters[key] === value
    )
  );
  
  const minPrice = variants?.length 
    ? Math.min(...variants.map(v => Number(v.price)))
    : 0;

  const hasValidDiscount = typeof product.discount === 'number' && product.discount > 0 && product.discount <= 100;
  const discountedPrice = hasValidDiscount ? minPrice * (1 - product.discount / 100) : minPrice;

  const selectedVariantPrice = selectedVariant?.price ?? 0;
  const finalSelectedVariantPrice = hasValidDiscount 
    ? selectedVariantPrice * (1 - product.discount / 100) 
    : selectedVariantPrice;

  const parameterKeys = variants?.length 
    ? [...new Set(variants.flatMap(v => Object.keys(v.parameters)))]
    : [];

  return (
    <div className="space-y-6">
      <ProductHeader 
        name={product.name} 
        discount={product.discount} 
        productId={product.id}
      />
      
      <PriceDisplay 
        hasValidDiscount={hasValidDiscount}
        discountedPrice={discountedPrice}
        minPrice={minPrice}
      />

      <RichTextContent content={product.description || ''} />
      
      <ProductVariantSection
        variants={variants}
        selectedParameters={selectedParameters}
        onParameterSelect={(key, value) => {
          setSelectedParameters(prev => ({
            ...prev,
            [key]: value
          }));
        }}
        product={product}
        userId={userId}
        selectedVariant={selectedVariant}
        finalSelectedVariantPrice={finalSelectedVariantPrice}
        isLoadingVariants={isLoadingVariants}
        parameterKeys={parameterKeys}
      />
    </div>
  );
}