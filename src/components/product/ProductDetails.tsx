import { Product } from "@/types";
import { SizeSelector } from "./SizeSelector";
import { AddToCartButton } from "./AddToCartButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ColorSelector } from "./ColorSelector";
import { useState } from "react";
import { Percent } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  userId: string | null;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

export const ProductDetails = ({ product, userId, selectedSize, onSizeSelect }: ProductDetailsProps) => {
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
  const isOutOfStock = selectedVariant?.stock <= 0;
  const minPrice = variants?.length 
    ? Math.min(...variants.map(v => v.price))
    : 0;

  // Calculate discounted price if discount exists and is valid
  const hasValidDiscount = typeof product.discount === 'number' && product.discount > 0 && product.discount <= 100;
  const discountedPrice = hasValidDiscount ? minPrice * (1 - product.discount / 100) : minPrice;

  const colors = [...new Set(variants?.map(v => v.color) || [])];

  // Calculate the actual price for the selected variant
  const selectedVariantPrice = selectedVariant?.price ?? 0;
  const finalSelectedVariantPrice = hasValidDiscount 
    ? selectedVariantPrice * (1 - product.discount / 100) 
    : selectedVariantPrice;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        {hasValidDiscount && (
          <Badge className="bg-red-500 text-white">
            <Percent className="h-4 w-4 mr-1" />
            {product.discount}% OFF
          </Badge>
        )}
      </div>
      
      <div className="space-y-1">
        {hasValidDiscount ? (
          <p className="text-xl text-red-500">From ${discountedPrice.toFixed(2)}</p>
        ) : (
          <p className="text-xl">From ${minPrice.toFixed(2)}</p>
        )}
      </div>

      <p className="text-gray-600">{product.description}</p>
      
      {isLoadingVariants ? (
        <p className="text-sm text-gray-500">Loading variants...</p>
      ) : variants && variants.length > 0 ? (
        <>
          <ColorSelector
            colors={colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />

          <SizeSelector 
            selectedSize={selectedSize} 
            onSizeSelect={onSizeSelect}
            variants={variants.filter(v => v.color === selectedColor)}
          />
          
          {selectedVariant && (
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Selected variant: ${finalSelectedVariantPrice.toFixed(2)}
              </p>
              {isOutOfStock && (
                <Badge variant="destructive" className="w-fit">
                  Out of Stock
                </Badge>
              )}
            </div>
          )}

          <AddToCartButton
            productId={product.id}
            userId={userId}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            productName={product.name}
            variants={variants}
            disabled={!selectedColor || !selectedSize || isOutOfStock}
          />
        </>
      ) : (
        <p className="text-sm text-gray-500">No variants available</p>
      )}
    </div>
  );
};