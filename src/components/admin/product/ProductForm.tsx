import { Product } from "@/types";
import { ImagePreview } from "./ImagePreview";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { CategorySelector } from "./CategorySelector";
import { FormActions } from "./FormActions";

interface ProductFormProps {
  formData: Product;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updates: Partial<Product>) => void;
  onCancel: () => void;
  onChooseImage: () => void;
}

export function ProductForm({
  formData,
  isSubmitting,
  onSubmit,
  onChange,
  onCancel,
  onChooseImage,
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
        onNameChange={(value) => onChange({ name: value })}
        onDescriptionChange={(value) => onChange({ description: value })}
        onSkuChange={(value) => onChange({ sku: value })}
      />

      <CategorySelector
        value={formData?.category ?? ""}
        onChange={(value) => onChange({ category: value })}
      />

      <ImagePreview
        imageUrl={formData?.image_url}
        productName={formData?.name}
        onChooseImage={onChooseImage}
      />

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
}