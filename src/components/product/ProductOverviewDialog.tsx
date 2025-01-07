import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductImage } from "./dialog/ProductImage";
import { ProductInfo } from "./dialog/ProductInfo";
import { VariantSelectionPanel } from "./dialog/VariantSelectionPanel";
import { DialogActions } from "./dialog/DialogActions";
import { Product } from "@/types";
import { useState, useEffect } from "react";

interface ProductOverviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  userId: string | null;
}

export function ProductOverviewDialog({
  product,
  isOpen,
  onClose,
  userId
}: ProductOverviewDialogProps) {
  const [selectedSize, setSelectedSize] = useState(
    product?.product_variants?.[0]?.size || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.product_variants?.[0]?.color || ""
  );
  const [dialogOpen, setDialogOpen] = useState(isOpen);

  // Sync dialog state with parent's isOpen prop
  useEffect(() => {
    setDialogOpen(isOpen);
  }, [isOpen]);

  const handleCartSuccess = () => {
    console.log('Product added to cart, closing dialog');
    setDialogOpen(false);
    onClose();
  };

  // Handle dialog state change
  const handleOpenChange = (open: boolean) => {
    console.log('Dialog open state changed:', open);
    setDialogOpen(open);
    if (!open) {
      onClose();
    }
  };

  if (!product) {
    console.log('No product data available');
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="relative h-[300px]">
            <ProductImage image={product.image_url} name={product.name} />
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
            <ProductInfo 
              name={product.name}
              variants={product.product_variants}
              discount={product.discount}
            />
            <VariantSelectionPanel
              variants={product.product_variants || []}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />
            <DialogActions
              productId={product.id}
              userId={userId}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              productName={product.name}
              variants={product.product_variants}
              onSuccess={handleCartSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}