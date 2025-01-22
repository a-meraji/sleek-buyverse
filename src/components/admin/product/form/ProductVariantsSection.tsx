import { ProductVariant } from "@/types";
import { VariantsManager } from "../VariantsManager";

interface ProductVariantsSectionProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export function ProductVariantsSection({ variants, onChange }: ProductVariantsSectionProps) {
  return (
    <VariantsManager
      variants={variants}
      onChange={onChange}
    />
  );
}