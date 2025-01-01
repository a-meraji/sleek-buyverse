import { Product } from "@/types";
import { ProductDetailsFields } from "../ProductDetailsFields";
import { CategorySelector } from "../CategorySelector";
import { DiscountField } from "./DiscountField";

interface ProductFormFieldsProps {
  formData: Partial<Product>;
  onFormChange: (updates: Partial<Product>) => void;
}

export function ProductFormFields({ formData, onFormChange }: ProductFormFieldsProps) {
  return (
    <>
      <ProductDetailsFields
        name={formData.name ?? ""}
        description={formData.description ?? ""}
        sku={formData.sku ?? ""}
        onNameChange={(value) => onFormChange({ name: value })}
        onDescriptionChange={(value) => onFormChange({ description: value })}
        onSkuChange={(value) => onFormChange({ sku: value })}
      />

      <CategorySelector
        value={formData.category ?? ""}
        onChange={(value) => onFormChange({ category: value })}
      />

      <DiscountField
        discount={formData.discount ?? null}
        onDiscountChange={(value) => onFormChange({ discount: value })}
      />
    </>
  );
}