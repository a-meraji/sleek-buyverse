import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductImage } from "./dialog/ProductImage";
import { ProductInfo } from "./dialog/ProductInfo";
import { VariantSelector } from "./dialog/VariantSelector";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "./AddToCartButton";
import { ProductVariant } from "@/types/product";

interface ProductOverviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  userId: string | null;
  variants?: ProductVariant[];
}

export function ProductOverviewDialog({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  productPrice,
  userId,
  variants = []
}: ProductOverviewDialogProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  console.log('ProductOverviewDialog render:', {
    productId,
    variants,
    selectedSize,
    selectedColor
  });

  // Reset selections when dialog opens
  useEffect(() => {
    if (isOpen && variants.length > 0) {
      const availableVariant = variants.find(v => v.stock > 0);
      if (availableVariant) {
        setSelectedSize(availableVariant.size);
        setSelectedColor(availableVariant.color);
      }
    }
  }, [isOpen, variants]);

  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = [...new Set(variants.map(v => v.color))];

  const selectedVariant = variants.find(v => 
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
            
            {variants.length > 0 ? (
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
              <p className="text-sm text-gray-500">
                No variants available for this product.
              </p>
            )}

            <AddToCartButton 
              productId={productId}
              userId={userId}
              selectedSize={selectedSize}
              productName={productName}
              disabled={!variants.length || isOutOfStock}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}