import { Product } from "@/types";
import { ProductVariant } from "@/types";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { CategorySelector } from "./CategorySelector";
import { VariantsManager } from "./VariantsManager";
import { ImageManager } from "./ImageManager";
import { Button } from "@/components/ui/button";

interface EditProductContentProps {
  formData: Product;
  variants: ProductVariant[];
  onFormChange: (updates: Partial<Product>) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
  onImageSelect: () => void;
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
  onSubmit,
  onClose,
  isSubmitting,
}: EditProductContentProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ProductDetailsFields
        name={formData.name}
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
        productId={formData.id}
      />

      <ImageManager
        productId={formData.id}
        mainImage={formData.image_url}
        additionalImages={formData.product_images}
        onMainImageSelect={onImageSelect}
        onImagesChange={(images) => onFormChange({ product_images: images })}
      />

      <div className="flex justify-end gap-2">
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