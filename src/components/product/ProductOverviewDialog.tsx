import { Dialog, DialogContent as BaseDialogContent } from "@/components/ui/dialog";
import { ProductVariant } from "@/types";
import { useState, useEffect } from "react";
import { DialogTitle } from "./dialog/DialogTitle";
import { DialogContent } from "./dialog/DialogContent";

interface ProductOverviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage: string;
  userId: string | null;
  variants?: ProductVariant[];
  discount?: number | null;
}

export function ProductOverviewDialog({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  userId,
  variants = [],
  discount
}: ProductOverviewDialogProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);

  // Sync internal open state with prop and handle cleanup
  useEffect(() => {
    if (isOpen) {
      console.log('Opening dialog, setting internal state');
      setInternalOpen(true);
    } else {
      console.log('Dialog prop changed to closed, cleaning up');
      handleClose();
    }
  }, [isOpen]);

  const handleClose = () => {
    console.log('Dialog closing, cleaning up states and overlay');
    setSelectedSize("");
    setSelectedColor("");
    setInternalOpen(false);
    // Ensure we call onClose after state updates
    setTimeout(() => {
      onClose();
    }, 0);
  };

  const handleSuccess = () => {
    console.log('Add to cart success, closing dialog');
    // Reset selection states and close the dialog
    setSelectedSize("");
    setSelectedColor("");
    handleClose();
  };

  return (
    <Dialog 
      open={internalOpen} 
      onOpenChange={(open) => {
        console.log('Dialog open state changing to:', open);
        if (!open) {
          handleClose();
        }
      }}
      modal={true}
    >
      <BaseDialogContent 
        className="sm:max-w-[425px] max-h-[90vh]"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        onEscapeKeyDown={handleClose}
      >
        <DialogTitle userId={userId} productId={productId} />
        <DialogContent
          productId={productId}
          productName={productName}
          productImage={productImage}
          userId={userId}
          variants={variants}
          discount={discount}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSizeSelect={setSelectedSize}
          onColorSelect={setSelectedColor}
          onSuccess={handleSuccess}
        />
      </BaseDialogContent>
    </Dialog>
  );
}