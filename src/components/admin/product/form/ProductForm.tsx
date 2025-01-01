import { Product } from "@/types";
import { ProductVariant } from "@/types";
import { ProductFormFields } from "./ProductFormFields";
import { VariantsManager } from "../VariantsManager";
import { ImageSelector } from "../ImageSelector";
import { FormActions } from "../FormActions";

interface ProductFormProps {
  formData: Partial<Product>;
  variants: ProductVariant[];
  showImageSelector: boolean;
  isSelectingMainImage: boolean;
  onFormChange: (updates: Partial<Product>) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
  onShowImageSelector: (show: boolean) => void;
  onSelectingMainImage: (selecting: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function ProductForm({
  formData,
  variants,
  showImageSelector,
  isSelectingMainImage,
  onFormChange,
  onVariantsChange,
  onShowImageSelector,
  onSelectingMainImage,
  onSubmit,
  onClose,
  isSubmitting,
}: ProductFormProps) {
  const handleImageSelect = (url: string) => {
    if (isSelectingMainImage) {
      onFormChange({ image_url: url });
    }
    onShowImageSelector(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ProductFormFields
        formData={formData}
        onFormChange={onFormChange}
      />

      <VariantsManager
        variants={variants}
        onChange={onVariantsChange}
      />

      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onClose}
      />

      <ImageSelector
        open={showImageSelector}
        onClose={() => onShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </form>
  );
}