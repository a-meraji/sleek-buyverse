import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductImage } from "./dialog/ProductImage";
import { ProductInfo } from "./dialog/ProductInfo";
import { VariantSelectionPanel } from "./dialog/VariantSelectionPanel";
import { DialogActions } from "./dialog/DialogActions";
import { ProductVariant } from "@/types/variant";
import { useState } from "react";

interface ProductOverviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage: string;
  userId: string | null;
  variants?: ProductVariant[];
}

export function ProductOverviewDialog({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  userId,
  variants = []
}: ProductOverviewDialogProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Product Overview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-120px)]">
          <div className="grid gap-4 py-4 px-1">
            <ProductImage image={productImage} name={productName} />
            <ProductInfo name={productName} variants={variants} />
            
            <VariantSelectionPanel
              variants={variants}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />

            <DialogActions
              productId={productId}
              userId={userId}
              selectedSize={selectedSize}
              productName={productName}
              disabled={!selectedSize || !selectedColor}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}