import { ProductInfo } from "./ProductInfo";
import { ProductImage } from "./ProductImage";
import { DialogActions } from "./DialogActions";
import { ProductVariant } from "@/types";
import { VariantSelector } from "./VariantSelector";

interface DialogContentProps {
  productId: string;
  productName: string;
  productImage: string;
  userId: string | null;
  variants?: ProductVariant[];
  discount?: number | null;
  parameterKeys: string[];
  selectedParameters: Record<string, string | number>;
  onParameterSelect: (key: string, value: string | number) => void;
  onSuccess?: () => void;
}

export function DialogContent({
  productId,
  productName,
  productImage,
  userId,
  variants = [],
  discount,
  parameterKeys,
  selectedParameters,
  onParameterSelect,
  onSuccess
}: DialogContentProps) {
  // Find matching variant based on selected parameters
  const selectedVariant = variants.find(variant => 
    parameterKeys.every(key => 
      variant.parameters[key] === selectedParameters[key]
    )
  );

  // Get unique values for each parameter
  const getParameterValues = (key: string) => {
    return Array.from(new Set(
      variants
        .map(v => v.parameters[key])
        .filter(Boolean)
    ));
  };

  return (
    <div className="grid gap-6">
      <ProductImage image={productImage} name={productName} discount={discount} />
      
      <ProductInfo 
        name={productName}
        variants={variants}
        discount={discount}
        selectedVariant={selectedVariant}
      />

      <div className="space-y-4">
        {parameterKeys.map(key => (
          <VariantSelector
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            options={getParameterValues(key)}
            value={selectedParameters[key]?.toString() || ''}
            onChange={(value) => onParameterSelect(key, value)}
          />
        ))}
      </div>

      <DialogActions
        productId={productId}
        userId={userId}
        selectedParameters={selectedParameters}
        productName={productName}
        disabled={!selectedVariant || Object.keys(selectedParameters).length !== parameterKeys.length}
        variants={variants}
        onSuccess={onSuccess}
      />
    </div>
  );
}