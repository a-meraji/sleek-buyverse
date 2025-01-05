import { Product } from "@/types";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { CategorySelector } from "./CategorySelector";
import { FormActions } from "./FormActions";
import { ProductImageSection } from "./form/ProductImageSection";

interface ProductFormProps {
  formData: Product;
  isSubmitting: boolean;
  showImageSelector: boolean;
  isSelectingMainImage: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updates: Partial<Product>) => void;
  onCancel: () => void;
  onChooseImage: () => void;
  onAddAdditionalImage: () => void;
  onImageSelect: (url: string) => void;
  onCloseImageSelector: () => void;
}

export function ProductForm({
  formData,
  isSubmitting,
  showImageSelector,
  isSelectingMainImage,
  onSubmit,
  onChange,
  onCancel,
  onChooseImage,
  onAddAdditionalImage,
  onImageSelect,
  onCloseImageSelector,
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
        mainImage={formData?.image_url}
        productName={formData?.name}
        showImageSelector={showImageSelector}
        isSelectingMainImage={isSelectingMainImage}
        onChooseMainImage={onChooseImage}
        onAddAdditionalImage={onAddAdditionalImage}
        onImageSelect={onImageSelect}
        onCloseImageSelector={onCloseImageSelector}
      />

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
}