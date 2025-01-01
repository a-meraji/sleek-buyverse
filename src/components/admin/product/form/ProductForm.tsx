import { Product } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { ProductDetailsFields } from "../ProductDetailsFields";
import { CategorySelector } from "../CategorySelector";
import { VariantsManager } from "../VariantsManager";
import { ImagePreview } from "../ImagePreview";
import { FormActions } from "../FormActions";

interface ProductFormProps {
  formData: Partial<Product>;
  variants: ProductVariant[];
  onFormChange: (updates: Partial<Product>) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
  onImageSelect: () => void;
  onAddAdditionalImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function ProductForm({
  formData,
  variants,
  onFormChange,
  onVariantsChange,
  onImageSelect,
  onAddAdditionalImage,
  onSubmit,
  onClose,
  isSubmitting,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded-lg">
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

      <VariantsManager
        variants={variants}
        onChange={onVariantsChange}
      />

      <ImagePreview
        imageUrl={formData.image_url}
        productName={formData.name}
        additionalImages={formData.product_images}
        onChooseImage={onImageSelect}
        onAddAdditionalImage={onAddAdditionalImage}
      />

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onClose}
      />
    </form>
  );
}