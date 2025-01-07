import { Dialog, DialogContent as BaseDialogContent } from "@/components/ui/dialog";
import { ProductVariant } from "@/types";
import { useState } from "react";
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

  const handleClose = () => {
    setSelectedSize("");
    setSelectedColor("");
    onClose();
  };

  const handleSuccess = () => {
    setSelectedSize("");
    setSelectedColor("");
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
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