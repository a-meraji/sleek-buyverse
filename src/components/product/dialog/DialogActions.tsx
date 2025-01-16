import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductVariant } from "@/types";

interface DialogActionsProps {
  productId: string;
  userId: string | null;
  selectedParameters: Record<string, string | number>;
  productName: string;
  disabled?: boolean;
  variants?: ProductVariant[];
  onSuccess?: () => void;
}

export function DialogActions({
  productId,
  userId,
  selectedParameters,
  productName,
  disabled,
  variants,
  onSuccess
}: DialogActionsProps) {
  // Find the selected variant based on parameters
  const selectedVariant = variants?.find(variant => 
    Object.entries(selectedParameters).every(([key, value]) => 
      variant.parameters[key] === value
    )
  );

  const isOutOfStock = selectedVariant?.stock <= 0;

  return (
    <div className="mt-4">
      <AddToCartButton
        productId={productId}
        userId={userId}
        selectedParameters={selectedParameters}
        productName={productName}
        disabled={disabled || isOutOfStock}
        variants={variants}
        onSuccess={onSuccess}
      />
    </div>
  );
}