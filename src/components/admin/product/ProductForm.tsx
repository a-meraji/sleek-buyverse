import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ImageSelector } from "../ImageSelector";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { CategorySelector } from "./CategorySelector";
import { VariantsManager } from "./VariantsManager";
import { ImagePreview } from "./ImagePreview";
import { useProductForm } from "./hooks/useProductForm";

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
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <ProductDetailsFields
          name={formData.name ?? ""}
          description={formData.description ?? ""}
          sku={formData.sku ?? ""}
          discount={formData.discount}
          onNameChange={(value) => handleFormChange({ name: value })}
          onDescriptionChange={(value) => handleFormChange({ description: value })}
          onSkuChange={(value) => handleFormChange({ sku: value })}
          onDiscountChange={(value) => handleFormChange({ discount: value })}
        />

        <CategorySelector
          value={formData.category ?? ""}
          onChange={(value) => handleFormChange({ category: value })}
        />

        <VariantsManager
          variants={variants}
          onChange={setVariants}
        />

        <ImagePreview
          imageUrl={formData.image_url}
          productName={formData.name}
          additionalImages={additionalImages.map((img, index) => ({
            id: `new-${index}`,
            image_url: img.image_url,
            product_id: '',
            display_order: index
          }))}
          onChooseImage={() => {
            setIsSelectingMainImage(true);
            setShowImageSelector(true);
          }}
          onAddAdditionalImage={() => {
            setIsSelectingMainImage(false);
            setShowImageSelector(true);
          }}
          onRemoveImage={handleRemoveImage}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createProduct.isPending}>
            Create Product
          </Button>
        </div>
      </form>

      <ImageSelector
        open={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />
    </>
  );
}