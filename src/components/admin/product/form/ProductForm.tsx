import { Product, ProductFormProps } from "@/types";
import { ImageSelector } from "../../ImageSelector";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductCategorySection } from "./ProductCategorySection";
import { ProductVariantsSection } from "./ProductVariantsSection";
import { ProductImagesSection } from "./ProductImagesSection";
import { ProductFormActions } from "./ProductFormActions";
import { useProductForm } from "./useProductForm";

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
    createProduct.mutate({
      formData,
      variants,
      additionalImages
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <ProductBasicInfo
          formData={formData}
          onFormChange={handleFormChange}
        />

        <ProductCategorySection
          category={formData.category ?? ""}
          onChange={(value) => handleFormChange({ category: value })}
        />

        <ProductVariantsSection
          variants={variants}
          onChange={setVariants}
        />

        <ProductImagesSection
          mainImage={formData.image_url ?? ""}
          productName={formData.name}
          additionalImages={additionalImages}
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