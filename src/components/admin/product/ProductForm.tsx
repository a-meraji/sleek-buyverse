import { Product } from "@/types";
import { ProductDetailsFields } from "../product/ProductDetailsFields";
import { CategorySelector } from "../product/CategorySelector";
import { FormActions } from "../product/FormActions";
import { ProductImageSection } from "./form/ProductImageSection";

interface ProductFormProps {
  formData: Product;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updates: Partial<Product>) => void;
  onCancel: () => void;
  onChooseImage: () => void;
  onAddAdditionalImage: () => void;
}

export function ProductForm({
  formData,
  isSubmitting,
  onSubmit,
  onChange,
  onCancel,
  onChooseImage,
  onAddAdditionalImage,
}: ProductFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <ProductImageSection
        imageUrl={formData?.image_url}
        productName={formData?.name}
        onChooseImage={onChooseImage}
        onAddAdditionalImage={onAddAdditionalImage}
      />

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
}