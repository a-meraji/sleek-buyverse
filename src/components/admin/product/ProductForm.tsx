import { Product } from "@/types";
import { FormFields } from "./form/FormFields";
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
      <FormFields 
        formData={formData}
        onChange={onChange}
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