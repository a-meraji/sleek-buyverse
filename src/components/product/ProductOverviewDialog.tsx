import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductVariant } from "@/types/product";
import { ProductImage } from "./dialog/ProductImage";
import { ProductInfo } from "./dialog/ProductInfo";
import { VariantSelector } from "./dialog/VariantSelector";
import { useAddToCart } from "./dialog/useAddToCart";

interface ProductOverviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  userId: string | null;
}

export function ProductOverviewDialog({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  productPrice,
  userId
}: ProductOverviewDialogProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const addToCart = useAddToCart();

  // Fetch product variants
  const { data: variants } = useQuery({
    queryKey: ['product-variants', productId],
    queryFn: async () => {
      console.log('Fetching variants for product:', productId);
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);

      if (error) {
        console.error('Error fetching variants:', error);
        throw error;
      }

      console.log('Variants fetched:', data);
      return data as ProductVariant[];
    }
  });

  // Set default color when variants are loaded
  useEffect(() => {
    if (variants && variants.length > 0) {
      setSelectedColor(variants[0].color);
      setSelectedSize(variants[0].size);
    }
  }, [variants]);

  // Group variants by size and color
  const sizes = [...new Set(variants?.map(v => v.size) || [])];
  const colors = [...new Set(variants?.map(v => v.color) || [])];

  const handleAddToCart = () => {
    addToCart.mutate(
      { 
        userId, 
        productId,
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Overview</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ProductImage image={productImage} name={productName} />
          <ProductInfo name={productName} price={productPrice} />
          
          {variants && variants.length > 0 ? (
            <>
              <VariantSelector
                label="Size"
                options={sizes}
                value={selectedSize}
                onChange={setSelectedSize}
              />
              <VariantSelector
                label="Color"
                options={colors}
                value={selectedColor}
                onChange={setSelectedColor}
              />
            </>
          ) : (
            <p className="text-sm text-gray-500">No variants available</p>
          )}

          <Button 
            onClick={handleAddToCart}
            disabled={addToCart.isPending || !variants?.length}
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}