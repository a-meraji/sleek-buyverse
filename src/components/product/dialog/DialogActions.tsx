import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductVariant } from "@/types";

interface DialogActionsProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  selectedColor: string;
  productName: string;
  disabled?: boolean;
  variants?: ProductVariant[];
  relatedProductId?: string;
  onSuccess?: () => void;
}

export function DialogActions({
  productId,
  userId,
  selectedSize,
  selectedColor,
  productName,
  disabled,
  variants,
  relatedProductId,
  onSuccess
}: DialogActionsProps) {
  return (
    <div className="mt-4">
      <AddToCartButton
        productId={productId}
        userId={userId}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        productName={productName}
        disabled={disabled}
        variants={variants}
        relatedProductId={relatedProductId}
        onSuccess={onSuccess}
      />
    </div>
  );
}