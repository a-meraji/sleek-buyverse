import { Product } from "@/types";
import { ProductVariant } from "@/types";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { CategorySelector } from "./CategorySelector";
import { VariantsManager } from "./VariantsManager";
import { ImagePreview } from "./ImagePreview";
import { Button } from "@/components/ui/button";

interface EditProductContentProps {
  formData: Product;
  variants: ProductVariant[];
  onFormChange: (updates: Partial<Product>) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
  onImageSelect: () => void;
  onAddAdditionalImage: () => void;
  onRemoveImage: (imageUrl: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function EditProductContent({
  formData,
  variants,
  onFormChange,
  onVariantsChange,
  onImageSelect,
  onAddAdditionalImage,
  onRemoveImage,
  onSubmit,
  onClose,
  isSubmitting,
}: EditProductContentProps) {
  console.log('Current form data:', formData);
  console.log('Current variants:', variants);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProductDetailsFields
        name={formData.name}
        description={formData.description ?? ""}
        sku={formData.sku ?? ""}
        brand={formData.brand ?? ""}
        discount={formData.discount}
        onNameChange={(value) => onFormChange({ name: value })}
        onDescriptionChange={(value) => onFormChange({ description: value })}
        onSkuChange={(value) => onFormChange({ sku: value })}
        onBrandChange={(value) => onFormChange({ brand: value })}
        onDiscountChange={(value) => onFormChange({ discount: value })}
      />

      <CategorySelector
        mainCategory={formData.main_category ?? ""}
        secondaryCategories={formData.secondary_categories || []}
        onMainCategoryChange={(value) => onFormChange({ main_category: value })}
        onSecondaryCategoriesChange={(categories) => 
          onFormChange({ secondary_categories: categories })
        }
      />

      <VariantsManager
        variants={variants}
        onChange={onVariantsChange}
        productId={formData.id}
      />

      <ImagePreview
        imageUrl={formData.image_url}
        productName={formData.name}
        additionalImages={formData.product_images}
        onChooseImage={onImageSelect}
        onAddAdditionalImage={onAddAdditionalImage}
        onRemoveImage={onRemoveImage}
      />

      <div className="flex justify-end gap-4 pt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}