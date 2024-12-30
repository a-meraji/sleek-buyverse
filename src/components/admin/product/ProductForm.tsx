import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./ImagePreview";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { PriceStockFields } from "./PriceStockFields";
import { CategorySelector } from "./CategorySelector";

interface ProductFormProps {
  formData: Product;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updates: Partial<Product>) => void;
  onCancel: () => void;
  onChooseImage: () => void;
}

export function ProductForm({
  formData,
  isSubmitting,
  onSubmit,
  onChange,
  onCancel,
  onChooseImage,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ProductDetailsFields
        name={formData?.name ?? ""}
        description={formData?.description ?? ""}
        sku={formData?.sku ?? ""}
        onNameChange={(value) => onChange({ name: value })}
        onDescriptionChange={(value) => onChange({ description: value })}
        onSkuChange={(value) => onChange({ sku: value })}
      />

      <PriceStockFields
        price={formData?.price ?? 0}
        onPriceChange={(value) => onChange({ price: value })}
      />

      <CategorySelector
        value={formData?.category ?? ""}
        onChange={(value) => onChange({ category: value })}
      />

      <ImagePreview
        imageUrl={formData?.image_url}
        productName={formData?.name}
        onChooseImage={onChooseImage}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}