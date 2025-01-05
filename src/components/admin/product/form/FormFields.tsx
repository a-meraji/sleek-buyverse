import { Product } from "@/types";
import { ProductDetailsFields } from "../ProductDetailsFields";
import { CategorySelector } from "../CategorySelector";

interface FormFieldsProps {
  formData: Product;
  onChange: (updates: Partial<Product>) => void;
}

export function FormFields({ formData, onChange }: FormFieldsProps) {
  return (
    <>
      <ProductDetailsFields
        name={formData?.name ?? ""}
        description={formData?.description ?? ""}
        sku={formData?.sku ?? ""}
        discount={formData?.discount ?? null}
        onNameChange={(value) => onChange({ name: value })}
        onDescriptionChange={(value) => onChange({ description: value })}
        onSkuChange={(value) => onChange({ sku: value })}
        onDiscountChange={(value) => onChange({ discount: value })}
      />

      <CategorySelector
        value={formData?.category ?? ""}
        onChange={(value) => onChange({ category: value })}
      />
    </>
  );
}