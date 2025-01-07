import { Product, ProductVariant } from "@/types";
import { VariantSelectionPanel } from "./VariantSelectionPanel";
import { AddToCartButton } from "../AddToCartButton";

interface ProductVariantSectionProps {
  variants: ProductVariant[] | null;
  selectedSize: string;
  selectedColor: string;
  onSizeSelect: (size: string) => void;
  setSelectedColor: (color: string) => void;
  product: Product;
  userId: string | null;
  selectedVariant: ProductVariant | undefined;
  finalSelectedVariantPrice: number;
  isLoadingVariants: boolean;
}

export const ProductVariantSection = ({
  variants,
  selectedSize,
  selectedColor,
  onSizeSelect,
  setSelectedColor,
  product,
  userId,
  selectedVariant,
  finalSelectedVariantPrice,
  isLoadingVariants
}: ProductVariantSectionProps) => {
  const colors = [...new Set(variants?.map(v => v.color) || [])];

  if (isLoadingVariants) {
    return <p className="text-sm text-gray-500">Loading variants...</p>;
  }

  if (!variants || variants.length === 0) {
    return <p className="text-sm text-gray-500">No variants available</p>;
  }

  return (
    <>
      <VariantSelectionPanel
        colors={colors}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        selectedSize={selectedSize}
        onSizeSelect={onSizeSelect}
        variants={variants}
        selectedVariant={selectedVariant}
        finalSelectedVariantPrice={finalSelectedVariantPrice}
      />

      <AddToCartButton
        productId={product.id}
        userId={userId}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        productName={product.name}
        variants={variants}
        disabled={!selectedColor || !selectedSize || (selectedVariant?.stock ?? 0) <= 0}
      />
    </>
  );
};