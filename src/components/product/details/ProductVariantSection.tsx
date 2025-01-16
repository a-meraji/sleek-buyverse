import { Product, ProductVariant } from "@/types";
import { VariantSelectionPanel } from "./VariantSelectionPanel";
import { AddToCartButton } from "../AddToCartButton";

interface ProductVariantSectionProps {
  variants: ProductVariant[] | null;
  selectedParameters: Record<string, string | number>;
  onParameterSelect: (key: string, value: string | number) => void;
  product: Product;
  userId: string | null;
  selectedVariant: ProductVariant | undefined;
  finalSelectedVariantPrice: number;
  isLoadingVariants: boolean;
  parameterKeys: string[];
}

export const ProductVariantSection = ({
  variants,
  selectedParameters,
  onParameterSelect,
  product,
  userId,
  selectedVariant,
  finalSelectedVariantPrice,
  isLoadingVariants,
  parameterKeys
}: ProductVariantSectionProps) => {
  if (isLoadingVariants) {
    return <p className="text-sm text-gray-500">Loading variants...</p>;
  }

  if (!variants || variants.length === 0) {
    return <p className="text-sm text-gray-500">No variants available</p>;
  }

  return (
    <div className="space-y-6">
      <VariantSelectionPanel
        variants={variants}
        selectedParameters={selectedParameters}
        onParameterSelect={onParameterSelect}
        selectedVariant={selectedVariant}
        finalSelectedVariantPrice={finalSelectedVariantPrice}
        parameterKeys={parameterKeys}
      />

      <AddToCartButton
        productId={product.id}
        userId={userId}
        selectedParameters={selectedParameters}
        productName={product.name}
        variants={variants}
        disabled={!selectedVariant || selectedVariant.stock <= 0}
      />
    </div>
  );
};