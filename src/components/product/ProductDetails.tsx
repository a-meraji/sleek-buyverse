import { Product } from "@/types";
import { SizeSelector } from "./SizeSelector";
import { AddToCartButton } from "./AddToCartButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ColorSelector } from "./ColorSelector";
import { useState } from "react";

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

  const colors = [...new Set(variants?.map(v => v.color) || [])];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl">From ${minPrice.toFixed(2)}</p>
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
                Selected variant: ${selectedVariant.price.toFixed(2)}
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