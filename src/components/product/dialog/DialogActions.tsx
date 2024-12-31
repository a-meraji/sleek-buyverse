import { AddToCartButton } from "../AddToCartButton";

interface DialogActionsProps {
  productId: string;
  userId: string | null;
  selectedSize: string;
  productName: string;
  disabled: boolean;
}

export function DialogActions({
  productId,
  userId,
  selectedSize,
  productName,
  disabled
}: DialogActionsProps) {
  return (
    <div className="mt-4">
      <AddToCartButton
        productId={productId}
        userId={userId}
        selectedSize={selectedSize}
        productName={productName}
        disabled={disabled}
      />
    </div>
  );
}