import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductVariant } from "@/types";

interface DialogActionsProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  productName: string;
  disabled?: boolean;
  variants?: ProductVariant[];
}

export function DialogActions({
  productId,
  userId,
  selectedSize,
  productName,
  disabled,
  variants
}: DialogActionsProps) {
  return (
    <div className="mt-4">
      <AddToCartButton
        productId={productId}
        userId={userId}
        selectedSize={selectedSize}
        productName={productName}
        disabled={disabled}
        variants={variants}
      />
    </div>
  );
}