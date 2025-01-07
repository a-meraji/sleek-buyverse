import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductImage } from "./ProductImage";
import { ProductInfo } from "./ProductInfo";
import { VariantSelectionPanel } from "./VariantSelectionPanel";
import { DialogActions } from "./DialogActions";
import { ProductVariant } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DialogContentProps {
  productId: string;
  productName: string;
  productImage: string;
  userId: string | null;
  variants?: ProductVariant[];
  discount?: number | null;
  selectedSize: string;
  selectedColor: string;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
  onSuccess: () => void;
}

export function DialogContent({
  productId,
  productName,
  productImage,
  userId,
  variants = [],
  discount,
  selectedSize,
  selectedColor,
  onSizeSelect,
  onColorSelect,
  onSuccess,
}: DialogContentProps) {
  const selectedVariant = variants.find(v => 
    v.size === selectedSize && v.color === selectedColor
  );

  return (
    <ScrollArea className="h-full max-h-[calc(90vh-120px)]">
      <div className="grid gap-4 py-4 px-1">
        <ProductImage image={productImage} name={productName} />
        <ProductInfo 
          name={productName} 
          variants={variants} 
          discount={discount}
          selectedVariant={selectedVariant}
        />
        
        <VariantSelectionPanel
          variants={variants}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSizeSelect={onSizeSelect}
          onColorSelect={onColorSelect}
          showOutOfStock={!!(selectedSize && selectedColor)}
        />

        <div className="flex gap-2 items-center">
          <DialogActions
            productId={productId}
            userId={userId}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            productName={productName}
            disabled={!selectedSize || !selectedColor}
            variants={variants}
            onSuccess={onSuccess}
          />
          <Link 
            to={`/product/${productId}`}
            className="flex-1"
          >
            <Button 
              variant="outline" 
              className="w-full"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </ScrollArea>
  );
}