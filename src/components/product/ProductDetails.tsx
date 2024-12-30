import { Product } from "@/types";
import { SizeSelector } from "./SizeSelector";
import { AddToCartButton } from "./AddToCartButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductDetailsProps {
  product: Product;
  userId: string | null;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

export const ProductDetails = ({ product, userId, selectedSize, onSizeSelect }: ProductDetailsProps) => {
  const { data: variants } = useQuery({
    queryKey: ['product-variants', product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id);

      if (error) throw error;
      return data;
    }
  });

  const selectedVariant = variants?.find(v => v.size === selectedSize);
  const isOutOfStock = selectedVariant?.stock <= 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl">${product.price.toFixed(2)}</p>
      <p className="text-gray-600">{product.description}</p>
      
      <SizeSelector 
        selectedSize={selectedSize} 
        onSizeSelect={onSizeSelect}
        variants={variants}
      />
      
      <AddToCartButton
        productId={product.id}
        userId={userId}
        selectedSize={selectedSize}
        productName={product.name}
        disabled={isOutOfStock}
      />
    </div>
  );
};