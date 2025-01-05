import { Product, ProductImage } from "@/types";
import { ProductVariant } from "@/types/variant";
import { ProductDetailsFields } from "../ProductDetailsFields";
import { CategorySelector } from "../CategorySelector";
import { VariantsManager } from "../VariantsManager";
import { FormActions } from "../FormActions";
import { ProductImageSection } from "./ProductImageSection";

interface ProductFormProps {
  formData: Partial<Product>;
  variants: ProductVariant[];
  additionalImages?: ProductImage[];
  showImageSelector: boolean;
  isSelectingMainImage: boolean;
  onFormChange: (updates: Partial<Product>) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
  onChooseMainImage: () => void;
  onAddAdditionalImage: () => void;
  onImageSelect: (url: string) => void;
  onCloseImageSelector: () => void;
  onRemoveImage?: (imageUrl: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function ProductForm({
  formData,
  variants,
  additionalImages = [],
  showImageSelector,
  isSelectingMainImage,
  onFormChange,
  onVariantsChange,
  onChooseMainImage,
  onAddAdditionalImage,
  onImageSelect,
  onCloseImageSelector,
  onRemoveImage,
  onSubmit,
  onClose,
  isSubmitting,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ProductDetailsFields
        name={formData.name ?? ""}
        description={formData.description ?? ""}
        sku={formData.sku ?? ""}
        discount={formData.discount}
        onNameChange={(value) => onFormChange({ name: value })}
        onDescriptionChange={(value) => onFormChange({ description: value })}
        onSkuChange={(value) => onFormChange({ sku: value })}
        onDiscountChange={(value) => onFormChange({ discount: value })}
      />

      <CategorySelector
        value={formData.category ?? ""}
        onChange={(value) => onFormChange({ category: value })}
      />

      <ProductImageSection
        mainImage={formData.image_url ?? ""}
        productName={formData.name}
        additionalImages={additionalImages}
        showImageSelector={showImageSelector}
        isSelectingMainImage={isSelectingMainImage}
        onChooseMainImage={onChooseMainImage}
        onAddAdditionalImage={onAddAdditionalImage}
        onImageSelect={onImageSelect}
        onCloseImageSelector={onCloseImageSelector}
        onRemoveImage={onRemoveImage}
      />

      <VariantsManager
        variants={variants}
        onChange={onVariantsChange}
      />

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onClose}
      />
    </form>
  );
}
