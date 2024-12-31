import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "./dialog/ProductImage";
import { ProductInfo } from "./dialog/ProductInfo";
import { VariantSelector } from "./dialog/VariantSelector";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "./AddToCartButton";

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

  console.log('ProductOverviewDialog render - productId:', productId, 'isOpen:', isOpen);

  const { data: variants, isLoading: isLoadingVariants, error, refetch } = useQuery({
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
      return data || []; // Ensure we always return an array
    },
    enabled: isOpen && !!productId, // Only fetch when dialog is open and we have a productId
    retry: 2, // Retry failed requests up to 2 times
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Reset selections when dialog opens
  useEffect(() => {
    if (isOpen) {
      console.log('Dialog opened, resetting selections. Current variants:', variants);
      if (variants && variants.length > 0) {
        const availableVariant = variants.find(v => v.stock > 0);
        if (availableVariant) {
          setSelectedSize(availableVariant.size);
          setSelectedColor(availableVariant.color);
          console.log('Selected variant:', availableVariant);
        }
      }
    }
  }, [isOpen, variants]);

  const sizes = [...new Set(variants?.map(v => v.size) || [])];
  const colors = [...new Set(variants?.map(v => v.color) || [])];

  console.log('Current sizes:', sizes);
  console.log('Current colors:', colors);

  const selectedVariant = variants?.find(v => 
    v.size === selectedSize && v.color === selectedColor
  );
  const isOutOfStock = selectedVariant?.stock <= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Product Overview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-120px)]">
          <div className="grid gap-4 py-4 px-1">
            <ProductImage image={productImage} name={productName} />
            <ProductInfo name={productName} price={productPrice} />
            
            {isLoadingVariants ? (
              <p className="text-sm text-gray-500">Loading variants...</p>
            ) : error ? (
              <div>
                <p className="text-sm text-red-500">Error loading variants. Please try again.</p>
                <button 
                  onClick={() => refetch()} 
                  className="text-sm text-blue-500 hover:underline mt-2"
                >
                  Retry
                </button>
              </div>
            ) : variants && variants.length > 0 ? (
              <>
                <VariantSelector
                  label="Size"
                  options={sizes}
                  value={selectedSize}
                  onChange={setSelectedSize}
                  variants={variants}
                />
                <VariantSelector
                  label="Color"
                  options={colors}
                  value={selectedColor}
                  onChange={setSelectedColor}
                />
                {isOutOfStock && (
                  <Badge variant="destructive" className="w-fit">
                    Out of Stock
                  </Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">No variants available for this product (ID: {productId})</p>
            )}

            <AddToCartButton 
              productId={productId}
              userId={userId}
              selectedSize={selectedSize}
              productName={productName}
              disabled={!variants?.length || isOutOfStock}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}