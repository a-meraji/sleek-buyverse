import { useState } from "react";
import { ImageSelector } from "../ImageSelector";
import { CategorySelector } from "./CategorySelector";
import { VariantsManager } from "./VariantsManager";
import { FormSection } from "./form/FormSection";
import { ProductBasicInfo } from "./form/ProductBasicInfo";
import { ProductImageSection } from "./form/ProductImageSection";
import { ProductFormActions } from "./form/ProductFormActions";
import { useProductForm } from "./hooks/useProductForm";
import { Product } from "@/types/product";

interface ProductFormProps {
  onClose: () => void;
  initialData?: Product;
}

export function ProductForm({ onClose, initialData }: ProductFormProps) {
  const {
    formData,
    additionalImages,
    variants,
    showImageSelector,
    isSelectingMainImage,
    handleFormChange,
    handleImageSelect,
    handleRemoveImage,
    setVariants,
    setShowImageSelector,
    setIsSelectingMainImage,
    createProduct,
  } = useProductForm({ onClose, initialData });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutate();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg">
        <FormSection>
          <ProductBasicInfo
            formData={formData}
            onFormChange={handleFormChange}
          />
        </FormSection>

        <FormSection>
          <CategorySelector
            value={formData.category ?? ""}
            onChange={(value) => handleFormChange({ category: value })}
          />
        </FormSection>

        <FormSection title="Product Variants">
          <VariantsManager
            variants={variants}
            onChange={setVariants}
          />
        </FormSection>

        <FormSection title="Product Images">
          <ProductImageSection
            mainImage={formData.image_url ?? ""}
            productName={formData.name}
            additionalImages={additionalImages.map((img, index) => ({
              id: `new-${index}`,
              image_url: img.image_url,
              product_id: '',
              display_order: index
            }))}
            onChooseMainImage={() => {
              setIsSelectingMainImage(true);
              setShowImageSelector(true);
            }}
            onAddAdditionalImage={() => {
              setIsSelectingMainImage(false);
              setShowImageSelector(true);
            }}
            onRemoveImage={handleRemoveImage}
          />
        </FormSection>

        <ProductFormActions
          isSubmitting={createProduct.isPending}
          onCancel={onClose}
        />
      </form>

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
}