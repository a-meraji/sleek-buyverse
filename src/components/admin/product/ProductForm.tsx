import { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./ImagePreview";

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
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <Input
          id="name"
          value={formData?.name ?? ""}
          onChange={(e) => onChange({ name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={formData?.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price</label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData?.price ?? ""}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-medium">Stock</label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData?.stock ?? ""}
            onChange={(e) => onChange({ stock: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <Input
          id="category"
          value={formData?.category ?? ""}
          onChange={(e) => onChange({ category: e.target.value })}
        />
      </div>

      <ImagePreview
        imageUrl={formData?.image_url}
        productName={formData?.name}
        onChooseImage={onChooseImage}
      />

      <div className="space-y-2">
        <label htmlFor="sku" className="text-sm font-medium">SKU</label>
        <Input
          id="sku"
          value={formData?.sku ?? ""}
          onChange={(e) => onChange({ sku: e.target.value })}
        />
      </div>

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