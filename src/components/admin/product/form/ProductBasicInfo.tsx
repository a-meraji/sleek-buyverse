import { Product } from "@/types/product";
import { ProductDetailsFields } from "../ProductDetailsFields";

interface ProductBasicInfoProps {
  formData: Partial<Product>;
  onFormChange: (updates: Partial<Product>) => void;
}

export function ProductBasicInfo({ formData, onFormChange }: ProductBasicInfoProps) {
  return (
    <ProductDetailsFields
      name={formData.name ?? ""}
      description={formData.description ?? ""}
      sku={formData.sku ?? ""}
      brand={formData.brand ?? ""}
      discount={formData.discount}
      onNameChange={(value) => onFormChange({ name: value })}
      onDescriptionChange={(value) => onFormChange({ description: value })}
      onSkuChange={(value) => onFormChange({ sku: value })}
      onBrandChange={(value) => onFormChange({ brand: value })}
      onDiscountChange={(value) => onFormChange({ discount: value })}
    />
  );
}