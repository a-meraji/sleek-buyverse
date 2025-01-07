import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProductHeader } from "./details/ProductHeader";
import { PriceDisplay } from "./details/PriceDisplay";
import { ProductVariantSection } from "./details/ProductVariantSection";

interface ProductDetailsProps {
  product: Product;
  userId: string | null;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

export const ProductDetails = ({ 
  product, 
  userId, 
  selectedSize, 
  onSizeSelect 
}: ProductDetailsProps) => {
  const [selectedColor, setSelectedColor] = useState("");

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

  const selectedVariant = variants?.find(v => v.size === selectedSize && v.color === selectedColor);
  
  // Calculate minimum price from all variants
  const minPrice = variants?.length 
    ? Math.min(...variants.map(v => Number(v.price)))
    : 0;

  const hasValidDiscount = typeof product.discount === 'number' && product.discount > 0 && product.discount <= 100;
  const discountedPrice = hasValidDiscount ? minPrice * (1 - product.discount / 100) : minPrice;

  const selectedVariantPrice = selectedVariant?.price ?? 0;
  const finalSelectedVariantPrice = hasValidDiscount 
    ? selectedVariantPrice * (1 - product.discount / 100) 
    : selectedVariantPrice;

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

      <p className="text-gray-600">{product.description}</p>
      
      <ProductVariantSection
        variants={variants}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSizeSelect={onSizeSelect}
        setSelectedColor={setSelectedColor}
        product={product}
        userId={userId}
        selectedVariant={selectedVariant}
        finalSelectedVariantPrice={finalSelectedVariantPrice}
        isLoadingVariants={isLoadingVariants}
      />
    </div>
  );
};