import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProductHeader } from "./details/ProductHeader";
import { PriceDisplay } from "./details/PriceDisplay";
import { ProductVariantSection } from "./details/ProductVariantSection";
import { RichTextContent } from "./RichTextContent";

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

  // Parse the description if it exists and is a string
  const parsedDescription = product.description ? (
    typeof product.description === 'string' ? 
      product.description : 
      JSON.stringify(product.description)
  ) : '';

  console.log('Parsed description:', parsedDescription);

  return (
    <div className="space-y-6">
      <ProductHeader 
        name={product.name} 
        discount={product.discount} 
        productId={product.id}
        brand={product.brand}
      />
      
      <PriceDisplay 
        hasValidDiscount={hasValidDiscount}
        discountedPrice={discountedPrice}
        minPrice={minPrice}
      />

      <div className="prose prose-sm max-w-none">
        <RichTextContent content={parsedDescription} />
      </div>
      
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
};